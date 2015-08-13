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
      $scope.autoscroll = true;

      function onevent(args) {
        $scope.download.infosPlowdown += args[0].last_infos_plowdown;
        $scope.download.sizeFile = args[0].size_file;
        $scope.download.sizeFileDownloaded = args[0].size_file_downloaded;
        $scope.download.sizePart = args[0].size_part;
        $scope.download.sizePartDownloaded = args[0].size_part_downloaded;
        $scope.download.progressFile = args[0].progress_file;
        $scope.download.progressPart = args[0].progress_part;
        $scope.download.status = args[0].status;
        $scope.download.currentSpeed = args[0].current_speed;
        $scope.download.timeLeft = args[0].time_left;
        $scope.download.timeSpent = args[0].time_spent;
        $scope.download.theoricalStartDatetime = args[0].theorical_start_datetime;

        if ($scope.startCounter == 0 && $scope.download.theoricalStartDatetime != 0 && $scope.download.theoricalStartDatetime > new Date().getTime()) {
          $scope.startCounter = Math.abs(($scope.download.theoricalStartDatetime - new Date().getTime()) / 1000);
        }
      }

      $scope.download = download;
      $scope.downloadPriorities = downloadPriorities;
      $scope.downloadPriority = {};
      $scope.startCounter = 0;
      $scope.downloadPriority.selected = $filter('filter')(downloadPriorities, { id: $scope.download.priority })[0];
      if ($scope.download.theoricalStartDatetime != 0 && $scope.download.theoricalStartDatetime > new Date().getTime()) {
        $scope.startCounter = Math.abs(($scope.download.theoricalStartDatetime - new Date().getTime()) / 1000);
      }
      DownloadResourceFctry.infos({Id: download.id},
        function (response) {
          if (response != '') {
            $scope.download.infosPlowdown = response.infos;
            $wamp.subscribe('plow.downloads.download.' + download.id, onevent);
          } else {
            $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
              $scope.download.infosPlowdown = translation;
            });
          }
        }
      );

      $scope.delete = function () {
        DownloadResourceFctry.deleteInfos({}, {id: download.id},
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
    }
  ]
);
