'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosactionCtrl
 * @description
 * # CtrlInfosactionCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosActionCtrl', ['$scope', 'ActionTypeResourceFctry',
    function ($scope, ActionTypeResourceFctry) {
      $scope.actionTypesList = [];
      $scope.actionType = {};
      ActionTypeResourceFctry.query({'action_type_has_property.editable': true}, function (response) {
        $scope.actionTypesList = response;
      });

    }]);
