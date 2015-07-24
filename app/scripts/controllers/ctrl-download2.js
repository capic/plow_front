'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('DownloadCtrl2', ['$scope', 'DownloadResourceFctry', 'downloadStatusListValue', 'uiGridGroupingConstants',
    function ($scope, DownloadResourceFctry, downloadStatusListValue, tasksManagementFcty, $modal, uiGridGroupingConstants) {

      $scope.gridOptions = {
        enableFiltering: true,
        treeRowHeaderAlwaysVisible: false,
        columnDefs: [
          {name: 'name'},
          {name: 'link'},
          {name: 'size'},
          {
            name: 'status',
            grouping: {groupPriority: 0},
            sort: {priority: 0, direction: 'asc'},
            cellFilter: 'downloadStatusFltr2'
            /*,
             cellTemplate: '<download-status-drtv status="row.entity" row="row"></download-status-drtv>'*/
          },
          {name: 'percent'},
          {name: 'Average speed'},
          {name: 'Time left'},
          {name: 'action'}
        ],
        onRegisterApi: function (gridApi) {
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
    }
  ]
);
