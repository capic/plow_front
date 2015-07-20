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
      $scope.infosPlowdown = DownloadResourceFctry.infos({id: download.id});

      $scope.delete = function () {
        DownloadResourceFctry.deleteInfos({id: download.id});
      };

      $scope.ok = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]
);
