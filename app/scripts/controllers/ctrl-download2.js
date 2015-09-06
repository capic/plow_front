'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('DownloadCtrl2', ['$scope', 'DownloadResourceFctry', 'downloadStatusListValue', 'downloadPriorities', '$modal', 'uiGridGroupingConstants', '$wamp',
    function ($scope, DownloadResourceFctry, downloadStatusListValue, downloadPriorities, $modal, uiGridGroupingConstants, $wamp) {

      function onevent(args) {
        console.log(args);
        angular.forEach($scope.gridOptions.data,
          function(download){
            download.subscribed = false;
          }
        );

        angular.forEach(args[0],
          function (downloadNotification) {
            var iterator = 0;
            var found = false;
            while (iterator < $scope.gridOptions.data.length && !found) {
              if (parseInt(downloadNotification.id) === parseInt($scope.gridOptions.data[iterator].id)) {
                found = true;
                $scope.gridOptions.data[iterator].progressFile = downloadNotification.progress_file;
                $scope.gridOptions.data[iterator].timeLeft = downloadNotification.time_left;
                $scope.gridOptions.data[iterator].status = downloadNotification.status;
                $scope.gridOptions.data[iterator].sizeFile = downloadNotification.size_file;
                if (downloadNotification.status != 3) { // TODO: use constant
                  $scope.gridOptions.data[iterator].subscribed = true;
                }
              }
              iterator++;
            }
          }
        );
      }

      $wamp.subscribe('plow.downloads.downloads', onevent);

      $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        showGridFooter: true,
        enableRowSelection: true,
        enableGroupHeaderSelection: true,
        rowHeight: 35,
        columnDefs: [
          {name: 'package', displayName: 'Paquet', grouping: {groupPriority: 1}, cellTooltip: true},
          {
            name: 'name',
            displayName: 'Name',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false
          },
          /*{name: 'link', displayName: 'Link', enableCellEdit: false},*/
          {
            name: 'sizeFile',
            displayName: 'Size',
            cellFilter: 'bytesFltr',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
          },
          {
            name: 'status',
            displayName: 'Status',
            grouping: {groupPriority: 0},
            sort: {priority: 1, direction: 'asc'},
            cellFilter: 'downloadStatusFltr2',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
            //cellTemplate: '<div ng-if="row.groupHeader">{{COL_FIELD | downloadStatusFltr2}}</div>'
          },
          {
            name: 'progressFile',
            displayName: '%',
            width: '40',
            enableColumnResizing: false,
            enableCellEdit: false
          },
          {
            name: 'averageSpeed',
            displayName: 'Avg Speed',
            cellFilter: 'bytesPerSecondFltr',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
          },
          {
            name: 'timeLeft',
            displayName: 'Time Left',
            cellFilter: 'timeFltr',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
          },
          {
            name: 'priority',
            displayName: 'Pty',
            enableColumnResizing: false,
            cellTemplate: '<div>{{COL_FIELD | downloadPriorityFltr |translate}}</div>',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'value',
            editDropdownOptionsArray: downloadPriorities,
            editDropdownFilter: 'translate',
            width: 70
          },
          {
            name: 'Actions',
            width: '100',
            enableColumnResizing: false,
            cellTemplate: '<div ng-if="!row.groupHeader" class="btn-group">' +
            '<a data-ng-click="startDownloading(row.entity);" data-ng-class="{\'disabled\': row.entity.status != 1, \'text-success\': row.entity.subscribed }" class="btn btn-action glyphicon glyphicon-play" href></a>' +
            '<a data-ng-click="grid.appScope.stopDownloading(row.entity);" data-ng-class="{\'disabled\': row.entity.status == 1}" class="btn btn-action glyphicon glyphicon-stop" href></a>' +
            '<a data-ng-click="grid.appScope.refreshDownload(row.entity);" class="btn btn-action glyphicon glyphicon-refresh" data-ng-class="grid.appScope.downloadRefreshInProgress[row.entity.id]" href></a>' +
            '<a data-ng-click="grid.appScope.deleteDownload(row.entity);" class=" btn btn-action glyphicon glyphicon-trash" href></a>' +
            '<a data-ng-click="grid.appScope.infosPlowdown(row.entity);" class=" btn btn-action glyphicon glyphicon-list-alt" href> </a>' +
            '</div>'
          }

        ],
        onRegisterApi: function
          (gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.selection.on.rowSelectionChanged($scope, function (rowChanged) {
            if (typeof(rowChanged.treeLevel) !== 'undefined' && rowChanged.treeLevel > -1) {
              // this is a group header
              var children = $scope.gridApi.treeBase.getRowChildren(rowChanged);
              children.forEach(function (child) {
                if (rowChanged.isSelected) {
                  $scope.gridApi.selection.selectRow(child.entity);
                } else {
                  $scope.gridApi.selection.unSelectRow(child.entity);
                }
              });
            }
          });
          $scope.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            if (newValue !== oldValue) {
              DownloadResourceFctry.updatePriority({id: rowEntity.id, priority: newValue},
                function () {
                },
                function () {
                  rowEntity.priority = oldValue;
                });
            }
          });

        }
      };

      downloadStatusListValue.status = DownloadResourceFctry.status(
        function () {
          DownloadResourceFctry.query(
            function (responses) {
              $scope.gridOptions.data = responses;
            }
          );
        }
      );

      $scope.downloadRefreshInProgress = [];
      $scope.allDownloadRefresh = false;

      // to refresh only one download
      $scope.refreshDownload = function (entity) {
        $scope.downloadRefreshInProgress[entity.id] = 'glyphicon-refresh-animate';

        DownloadResourceFctry.refreshDownload({'Id': entity.id}, function (response) {
          var idx = $scope.gridOptions.data.indexOf(entity);
          $scope.gridOptions.data[idx] = response;

          $scope.downloadRefreshInProgress[entity.id] = '';
        });
      };

      // to refresh all downloads list
      $scope.refresh = function () {
        $scope.allDownloadRefresh = true;
        $scope.downloadsList = DownloadResourceFctry.refresh(function () {
          $scope.allDownloadRefresh = false;
        });
      };

      // to delete a download
      $scope.deleteDownload = function (entity) {
        DownloadResourceFctry.delete({Id: entity.id}, function (response) {
          if (response.status === true) {
            var idx = $scope.gridOptions.data.indexOf(entity);
            $scope.gridOptions.data.splice(idx, 1);
          }
        });
      };

      // to delete the selected downloads
      $scope.deleteSelectedDownloads = function () {
        var selectedIds = [];
        angular.forEach($scope.gridApi.selection.getSelectedRows(), function (entity) {
          selectedIds.push(entity.id);
        });

        DownloadResourceFctry.remove({ListId: selectedIds}, function (response) {
          if (response.status === true) {
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (entity) {
              var idx = $scope.gridOptions.data.indexOf(entity);
              $scope.gridOptions.data.splice(idx, 1);
            });
          }
        });
      };

      $scope.infosPlowdown = function (download) {
        $scope.modal = $modal.open({
          templateUrl: 'views/downloads/infosPlowdownPopup2.html',
          controller: 'InfosPlowdownCtrl',
          size: 'lg',
          resolve: {
            download: function () {
              return angular.copy(download);
            }
          }
        });
      };


    }
  ]
)
;
