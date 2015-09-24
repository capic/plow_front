'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', '$filter', 'DownloadResourceFctry', 'downloadPriorities', 'download', '$wamp',
    function ($scope, $modalInstance, $translate, $filter, DownloadResourceFctry, downloadPriorities, download, $wamp) {
      function onevent(args) {
        var down = angular.fromJson(args[0]);

        $scope.download.size_file = down.size_file;
        $scope.download.size = down.size;
        $scope.download.size_file_downloaded = down.size_file_downloaded;
        $scope.download.size_part = down.size_part;
        $scope.download.size_part_downloaded = down.size_part_downloaded;
        $scope.download.progress_file = down.progress_file;
        $scope.download.progress_part = down.progress_part;
        $scope.download.status = down.status;
        $scope.download.current_speed = down.current_speed;
        $scope.download.time_left = down.time_left;
        $scope.download.time_spent = down.time_spent;
        $scope.download.theorical_start_datetime = down.theorical_start_datetime;

        if ($scope.startCounter == 0 && (Date.parse($scope.download.theorical_start_datetime) > new Date().getTime())) {
          $scope.startCounter = (Date.parse($scope.download.theorical_start_datetime) - new Date().getTime()) / 1000;
        }

        if (down.status == 3) { //TODO: utiliser une constante
          $wamp.unsubscribe('plow.downloads.download.' + download.id);
          $wamp.unsubscribe('plow.downloads.logs.' + download.id);
        }
      }

      function oneventLogs(args) {
        var downLogs = angular.fromJson(args[0]);
        $scope.download.logs += downLogs.logs;
      }

      $scope.download = download;
      $scope.download.logs = '';
      $scope.downloadPriorities = downloadPriorities;
      $scope.downloadPriority = {};
      $scope.startCounter = 0;
      $scope.downloadPriority.selected = $filter('filter')(downloadPriorities, { id: $scope.download.priority })[0];
      $scope.autoscroll = true;
      $scope.pathEdition = false;
      $scope.edition = {};
      $scope.edition.downloadDirectory = angular.copy($scope.download.directory);

      if (Date.parse($scope.download.theorical_start_datetime) > new Date().getTime()) {
        $scope.startCounter = (Date.parse($scope.download.theorical_start_datetime) - new Date().getTime()) / 1000;
      }

      DownloadResourceFctry.logs({Id: download.id},
        function (response) {
          if (response != '') {
            $scope.download.logs = response.logs;
            $wamp.subscribe('plow.downloads.download.' + download.id, onevent);
            $wamp.subscribe('plow.downloads.logs.' + download.id, oneventLogs);
          } else {
            $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
              $scope.download.infosPlowdown = translation;
            });
          }
        }
      );

      $scope.delete = function () {
        DownloadResourceFctry.deleteLogs({}, {id: download.id},
          function (response) {
            if (response.status == true) {
              $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
                $scope.download.infosPlowdown = translation;
              });
            }
          }, function () {
          });
      };

      $scope.ok = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.$watch("downloadPriority.selected",
        function(newVal, oldVal) {
          if (newVal != oldVal) {
           DownloadResourceFctry.updatePriority({id: newVal});
          }
        }
      );

      $scope.modifyPath = function () {
        if ($scope.edition.downloadDirectory != $scope.download.directory) {
          var oldStatus = download.status;
          //TODO: utiliser une constante
          download.status = 9;
          DownloadResourceFctry.move({id: download.id, directory: $scope.edition.downloadDirectory},
            function (down) {
              $scope.download = down;
            },
            function () {
              download.status = oldStatus;
            }
          );

        }

        $scope.pathEdition = false;
      };
    }
  ]
);
