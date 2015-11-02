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
        var down = angular.fromJson(args[0]);

        angular.forEach($scope.gridOptions.data,
          function (download) {
            download.subscribed = false;
          }
        );

        var iterator = 0;
        var found = false;

        while (iterator < $scope.gridOptions.data.length && !found) {
          if (parseInt(down.id) === parseInt($scope.gridOptions.data[iterator].id)) {
            var now = new Date();
            found = true;
            $scope.gridOptions.data[iterator].progress_file = down.progress_file;
            $scope.gridOptions.data[iterator].time_left = down.time_left;
            $scope.gridOptions.data[iterator].status = down.status;
            $scope.gridOptions.data[iterator].size_file = down.size_file;
            $scope.gridOptions.data[iterator].average_speed = down.average_speed;
            $scope.gridOptions.data[iterator].theorical_start_datetime = new Date(down.theorical_start_datetime);

            $scope.gridOptions.data[iterator].counter = 0;
            if ($scope.gridOptions.data[iterator].theorical_start_datetime.getTime() > now) {
              $scope.gridOptions.data[iterator].counter = Math.round(( $scope.gridOptions.data[iterator].theorical_start_datetime.getTime() - now) / 1000);
            }

            if (down.status != 3) { // TODO: use constant
              $scope.gridOptions.data[iterator].subscribed = true;
            }
          }
          iterator++;
        }

        // => new download
        if (!found) {
          $scope.gridOptions.data.push(down);
        }
      }

      $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        showGridFooter: true,
        enableRowSelection: true,
        enableGroupHeaderSelection: true,
        rowHeight: 35,
        columnDefs: [
          {
            name: 'download_package.name',
            displayName: 'Paquet',
            //grouping: {groupPriority: 0},
            cellTooltip: true
          },
          {
            name: 'name',
            displayName: 'Name',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false
          },
          /*{name: 'link', displayName: 'Link', enableCellEdit: false},*/
          {
            name: 'size_file',
            displayName: 'Size',
            cellFilter: 'bytesFltr',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
          },
          {
            name: 'status',
            displayName: 'Status',
            // grouping: {groupPriority: 0},
            //sort: {priority: 1, direction: 'asc'},
            cellFilter: 'downloadStatusFltr2',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
            //cellTemplate: '<div ng-if="row.groupHeader">{{COL_FIELD | downloadStatusFltr2}}</div>'
          },
          {
            name: 'progress_file',
            displayName: '%',
            width: '40',
            enableColumnResizing: false,
            enableCellEdit: false
          },
          {
            name: 'average_speed',
            displayName: 'Avg Speed',
            cellFilter: 'bytesPerSecondFltr',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80
          },
          {
            name: 'time_left',
            displayName: 'Time Left',
            enableColumnResizing: false,
            enableCellEdit: false,
            width: 80,
            cellTemplate: '<div data-ng-if="row.entity.counter > 0 && row.entity.status == 2">' +
            '<timer interval="1000" countdown="row.entity.counter">- {{countdown | timeFltr}}</timer>' +
            '</div>' +
            '<div data-ng-if="row.entity.counter <= 0 || row.entity.status != 2">{{COL_FIELD | timeFltr}}</div>'
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
            name: ' ',
            width: '35',
            enableColumnResizing: false,
            enableCellEdit: false,
            cellTemplate: '/views/downloads/myDropDown.html'
          }
        ],

        onRegisterApi: function (gridApi) {
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
              angular.forEach(responses,
                function (response) {
                  var now = new Date().getTime();
                  response.theorical_start_datetime = new Date(response.theorical_start_datetime);

                  response.counter = 0;
                  if (response.status == 2 && response.theorical_start_datetime.getTime() > now) {
                    response.counter = Math.round((response.theorical_start_datetime.getTime() - now) / 1000);
                  }

                  $scope.gridOptions.data.push(response);
                }
              );

              $wamp.subscribe('plow.downloads.downloads', onevent);
            }
          );
        }
      );

      $scope.downloadRefreshInProgress = [];
      $scope.allDownloadRefresh = false;

      // to refresh only one download
      $scope.refreshDownload = function (entity) {
        $scope.allDownloadRefresh = true;
        $scope.downloadRefreshInProgress[entity.id] = 'glyphicon-refresh-animate';

        DownloadResourceFctry.refreshDownload({'Id': entity.id}, function (response) {
          var idx = $scope.gridOptions.data.indexOf(entity);
          $scope.gridOptions.data[idx] = response;

          $scope.downloadRefreshInProgress[entity.id] = '';
          $scope.allDownloadRefresh = false;
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
          if (response.return === true) {
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
          backdrop: 'static',
          size: 'lg',
          resolve: {
            download: function () {
              return download;
            }
          }
        });

        $scope.modal.result.then(
          function (downReturned) {
            var idx = $scope.gridOptions.data.indexOf(download);
            $scope.gridOptions.data[idx] = downReturned;
          }
        );
      };
    }
  ]
);
