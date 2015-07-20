'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', 'download',
    function ($scope, $modalInstance, download) {
      $scope.download = download;

      $scope.ok = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]
);
