'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', 'DownloadResourceFctry', 'download',
    function ($scope, $modalInstance, DownloadResourceFctry, download) {
      $scope.infosPlowdown = DownloadResourceFctry.infos({Id: download.id});

      $scope.delete = function () {
        DownloadResourceFctry.deleteInfos({}, {id: download.id},
          function (response) {
            if (response.status == true) {
              $scope.infosPlowdown = '';
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
