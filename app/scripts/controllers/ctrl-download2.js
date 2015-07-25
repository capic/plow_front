'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('DownloadCtrl2', ['$scope', 'DownloadResourceFctry', 'downloadStatusListValue', '$modal', 'uiGridGroupingConstants',
    function ($scope, DownloadResourceFctry, downloadStatusListValue, $modal, uiGridGroupingConstants) {

      $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        showGridFooter: true,
        enableRowSelection: true,
        rowHeight: 35,
        columnDefs: [
          {name: 'name', displayName: 'Name', cellTooltip: true},
          {name: 'link', displayName: 'Link'},
          {name: 'size', displayName: 'Size', cellFilter: 'bytesFltr', enableColumnResizing: false},
          {
            name: 'status',
            displayName: 'Status',
            grouping: {groupPriority: 0},
            sort: {priority: 0, direction: 'asc'},
            cellFilter: 'downloadStatusFltr2',
            enableColumnResizing: false
            /*,
             cellTemplate: '<download-status-drtv status="row.entity" row="row"></download-status-drtv>'*/
          },
          {name: 'progress', displayName: '%', width: '40', enableColumnResizing: false},
          {
            name: 'averageSpeed',
            displayName: 'Avg Speed',
            cellFilter: 'bytesPerSecondFltr',
            enableColumnResizing: false
          },
          {name: 'timeLeft', displayName: 'Time Left', cellFilter: 'timeFltr', enableColumnResizing: false},
          {name: 'priority', displayName: 'Pty', width: '100', enableColumnResizing: false},
          {
            name: 'Actions',
            width: '100',
            enableColumnResizing: false,
            cellTemplate: '<div ng-if="!row.groupHeader" class="btn-group">' +
            '<a data-ng-click="startDownloading(row.entity);" data-ng-class="{\'disabled\': row.entity.status != 1}" class="btn btn-action glyphicon glyphicon-play" href></a>' +
            '<a data-ng-click="grid.appScope.stopDownloading(row.entity);" data-ng-class="{\'disabled\': row.entity.status == 1}" class="btn btn-action glyphicon glyphicon-stop" href></a>' +
            '<a data-ng-click="grid.appScope.refreshDownload(row.entity);" class="btn btn-action glyphicon glyphicon-refresh" data-ng-class="grid.appScope.downloadRefreshInProgress[row.entity.id]" href></a>' +
            '<a data-ng-click="deleteDownload(row.entity);" class=" btn btn-action glyphicon glyphicon-trash" href></a>' +
            '<a data-ng-click="grid.appScope.infosPlowdown(row.entity);" class=" btn btn-action glyphicon glyphicon-list-alt" href data-ng-if="row.entity.hasInfosPlowdown"> </a>' +
            '</div>'
          }

        ],
        onRegisterApi: function
          (gridApi) {
          $scope.gridApi = gridApi;
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

      // to refresh only one download
      $scope.refreshDownload = function (entity) {
        $scope.downloadRefreshInProgress[entity.id] = 'glyphicon-refresh-animate';

        DownloadResourceFctry.refreshDownload({'Id': entity.id}, function (response) {
          var idx = $scope.gridOptions.data.indexOf(entity);
          $scope.gridOptions.data[idx] = response;

          $scope.downloadRefreshInProgress[entity.id] = '';
        });
      };

      $scope.infosPlowdown = function (download) {
        $scope.modal = $modal.open({
          templateUrl: 'views/downloads/infosPlowdownPopup.html',
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
