'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', '$filter', 'DownloadResourceFctry', 'downloadPriorities', 'download',
    function ($scope, $modalInstance, $translate, $filter, DownloadResourceFctry, downloadPriorities, download) {

      $scope.download = download;
      $scope.downloadPriorities = downloadPriorities;
      $scope.downloadPriority = {};
      $scope.downloadPriority.selected = $filter('filter')(downloadPriorities, { id: $scope.download.priority })[0];

      DownloadResourceFctry.infos({Id: download.id},
        function (response) {
          if (response != '') {
            $scope.download.infosPlowdown = response.infos;
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
