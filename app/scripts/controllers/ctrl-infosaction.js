'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosactionCtrl
 * @description
 * # CtrlInfosactionCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosActionCtrl', ['$scope', 'ActionTypeResourceFctry', 'DirectoryResourceFctry',
    function ($scope, ActionTypeResourceFctry, DirectoryResourceFctry) {
      $scope.actionTypesList = [];
      $scope.actionType = {};
      $scope.actionProperty = {};
      $scope.listPath = [];

      ActionTypeResourceFctry.query({'action_type_has_property.editable': true}, function (response) {
        $scope.actionTypesList = response;
      });

      $scope.directoryQueryPromise = DirectoryResourceFctry.query(
        function (response) {
          $scope.listPath = response;
        }
      );

      $scope.ok = function () {
        var action = {
          // TODO: utiliser une constante
          action_status_id: 1,
          action_type_id: $scope.actionType.id,
          action_has_properties: [$scope.actionProperty]

        };
        console.log(action);
      }

    }]);
