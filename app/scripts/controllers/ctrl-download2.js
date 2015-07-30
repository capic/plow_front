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

      $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        showGridFooter: true,
        enableRowSelection: true,
        enableGroupHeaderSelection: true,
        rowHeight: 35,
        columnDefs: [
          {name: 'name', displayName: 'Name', cellTooltip: true, headerCellFilter: 'translate'},
          {name: 'link', displayName: 'Link'},
          {name: 'sizeFile', displayName: 'Size', cellFilter: 'bytesFltr', enableColumnResizing: false},
          {
            name: 'status',
            displayName: 'Status',
            grouping: {groupPriority: 1},
            sort: {priority: 1, direction: 'asc'},
            cellFilter: 'downloadStatusFltr2',
            enableColumnResizing: false
            /*,
             cellTemplate: '<download-status-drtv status="row.entity" row="row"></download-status-drtv>'*/
          },
          {name: 'progressFile', displayName: '%', width: '40', enableColumnResizing: false},
          {
            name: 'averageSpeed',
            displayName: 'Avg Speed',
            cellFilter: 'bytesPerSecondFltr',
            enableColumnResizing: false
          },
          {name: 'timeLeft', displayName: 'Time Left', cellFilter: 'timeFltr', enableColumnResizing: false},
          {
            name: 'priority',
            displayName: 'Pty',
            width: '100',
            enableColumnResizing: false,
            cellTemplate: '<div>{{COL_FIELD | downloadPriorityFltr |translate}}</div>',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'value',
            editDropdownOptionsArray: downloadPriorities,
            editDropdownFilter: 'translate'
          },
          {
            name: 'Actions',
            width: '100',
            enableColumnResizing: false,
            cellTemplate: '<div ng-if="!row.groupHeader" class="btn-group">' +
            '<a data-ng-click="startDownloading(row.entity);" data-ng-class="{\'disabled\': row.entity.status != 1}" class="btn btn-action glyphicon glyphicon-play" href></a>' +
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

      function onevent(args) {
        $scope.hello = args[0];
      }
      $wamp.subscribe('com.myapp.hello', onevent);
    }
  ]
)
;
