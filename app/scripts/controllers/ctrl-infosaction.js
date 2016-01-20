'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosactionCtrl
 * @description
 * # CtrlInfosactionCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosActionCtrl', ['$scope', '$filter', '$modalInstance', 'download', 'ActionTypeResourceFctry', 'ActionResourceFctry', 'DirectoryResourceFctry',
    function ($scope, $filter, $modalInstance, download, ActionTypeResourceFctry, ActionResourceFctry, DirectoryResourceFctry) {
      $scope.actionTypesList = [];
      $scope.actionType = {};
      $scope.actionProperty = {};
      $scope.actionPropertyDirectory = {};
      $scope.listPath = [];

      $scope.actionTypeQueryPromise = ActionTypeResourceFctry.query({'action_type_has_property.editable': true}, function (response) {
        $scope.actionTypesList = response;
      });

      $scope.directoryQueryPromise = DirectoryResourceFctry.query(
        function (response) {
          $scope.listPath = response;
          // on enleve de la liste le repertoire actuelle du telechargement
          var tabResult = $filter('filter')(response, {id: download.directory.id}, true);
          if (tabResult.length > 0) {
            $scope.listPath.splice(tabResult[0], 1);
          }
        }
      );

      $scope.ok = function () {
        var action = {
          // TODO: utiliser une constante
          action_status_id: 1,
          action_type_id: $scope.actionType.id,
          action_has_properties: [
          ]
        };

        // TODO: utiliser des constantes
        if ($scope.actionType.action_target_id == 2) {
          action.download_package_id = download.package_id;
        } else {
          action.download_id = download.id;
        }

        if ($scope.actionProperty.hasOwnProperty('property_id')) {
          var property = {
            property_id: $scope.actionProperty.property_id
          };
          if ($scope.actionProperty.property_id == 3) {
            property.directory_id = $scope.actionPropertyDirectory.directory.id;
          } else {
            property.property_value = $scope.actionProperty.property_value;
          }

          action.action_has_properties.push(property);
        }

        if ($scope.actionType.id == 1 || $scope.actionType.id == 3) {
          // on ajoute le dossier source
          action.action_has_properties.push({property_id: 2, directory_id: download.directory_id})
        } else if ($scope.actionType.id == 2) {
          // on ajoute le dossier destination
          action.action_has_properties.push({property_id: 3, directory_id: download.directory_id})
        }

        ActionResourceFctry.save({action: JSON.stringify(action)}, function(response) {
          console.log(response);
        });

        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }]);
