'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', 'DownloadResourceFctry', 'download',
    function ($scope, $modalInstance, $translate, DownloadResourceFctry, download) {
      DownloadResourceFctry.infos({Id: download.id},
        function (response) {
          if (response != '') {
            $scope.infosPlowdown = response;
          } else {
            $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
              $scope.infosPlowdown = translation;
            });
          }
        }
      );

      $scope.delete = function () {
        DownloadResourceFctry.deleteInfos({}, {id: download.id},
          function (response) {
            if (response.status == true) {
              $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
                $scope.infosPlowdown = translation;
              });
            }
          }, function () {
          });
      };

      $scope.ok = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]
);
