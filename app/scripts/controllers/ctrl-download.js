'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('DownloadCtrl', ['$scope', 'DownloadResourceFctry', 'downloadStatusListValue', 'tasksManagementFcty', '$modal',
    function ($scope, DownloadResourceFctry, downloadStatusListValue, tasksManagementFcty, $modal) {
      // the list of downloads
      $scope.downloadsList = [];
      // tab for the animate refresh icon
      $scope.downloadRefreshInProgress = [];

      var taskId = tasksManagementFcty.addTask('notifications.tasks.downloadCtrl.GET_DOWNLOAD_STATUS');
      // get the status list for the column status
      downloadStatusListValue.status = DownloadResourceFctry.status(function () {
        tasksManagementFcty.removeTask(taskId);
        taskId = tasksManagementFcty.addTask('notifications.tasks.downloadCtrl.GET_DOWNLOADS');
        DownloadResourceFctry.query(function (response) {
          $scope.downloadsList = response;
          tasksManagementFcty.removeTask(taskId);
        });
      });

      // to refresh all downloads list
      $scope.refresh = function () {
        $scope.downloadsList = DownloadResourceFctry.refresh();
      };

      // to refresh only one download
      $scope.refreshDownload = function (entity) {
        $scope.downloadRefreshInProgress[entity.id] = 'glyphicon-refresh-animate';

        DownloadResourceFctry.refreshDownload({'Id': entity.id}, function (response) {
          var idx = $scope.downloadsList.indexOf(entity);
          $scope.downloadsList[idx] = response;

          $scope.downloadRefreshInProgress[entity.id] = '';
        });
      };

      // to start to import the links from the log
      $scope.import = function () {
        $scope.downloadsList = DownloadResourceFctry.import();
      };

      // to delete a download
      $scope.deleteDownload = function (entity) {
        taskId = tasksManagementFcty.addTask('notifications.tasks.downloadCtrl.DELETE_DOWNLOAD');
        DownloadResourceFctry.delete({Id: entity.id}, function (response) {
          if (response.status === true) {
            var idx = $scope.downloadsList.indexOf(entity);
            $scope.downloadsList.splice(idx, 1);
          }

          tasksManagementFcty.removeTask(taskId);
        });
      };

      // to delete the selected downloads
      $scope.deleteSelectedDownloads = function () {
        taskId = tasksManagementFcty.addTask('notifications.tasks.downloadCtrl.DELETE_SELECTED_DOWNLOADS');

        var selectedDownloadsList = $scope.downloadsList.filter(
          function (download) {
            return download.hasOwnProperty('selected') && download.selected === true;
          }
        );
        var selectedIds = [];
        angular.forEach(selectedDownloadsList, function (entity) {
          selectedIds.push(entity.id);
        });

        DownloadResourceFctry.remove({ListId: selectedIds}, function (response) {
          if (response.status === true) {
            angular.forEach(selectedDownloadsList, function (entity) {
              var idx = $scope.downloadsList.indexOf(entity);
              $scope.downloadsList.splice(idx, 1);
            });
          }

          tasksManagementFcty.removeTask(taskId);
        });
      };

      // to start downloading
      $scope.startDownloading = function (entity) {
        DownloadResourceFctry.start({}, {id: entity.id},
          function (response) {
            var idx = $scope.downloadsList.indexOf(entity);
            var download = response[0];
            download.started = true;
            $scope.downloadsList[idx] = download;
          }
        );
      };

      // to stop donwloading
      $scope.stopDownloading = function (entity) {
        DownloadResourceFctry.stop({id: entity.id},
          function (response) {
            var idx = $scope.downloadsList.indexOf(entity);
            var download = response[0];
            download.started = false;
            $scope.downloadsList[idx] = download;
          }
        );
      };

      // when the add new download event is fired
      $scope.$on('addNewLinksToDownloadsList', function (event, newDownloadsList) {
        angular.forEach(newDownloadsList, function (newDownload) {
          $scope.downloadsList.push(newDownload);
        });
      });

      $scope.selectAllDownload = function (checkAll) {
        angular.forEach($scope.downloadsList, function (download) {
          download.selected = checkAll;
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

        $scope.modal.result.then(
          //success
          function () {

          },
          // cancel
          function () {

          }
        )
      };
    }
  ]
);
