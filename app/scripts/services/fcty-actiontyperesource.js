'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyActiontyperesource
 * @description
 * # fctyActiontyperesource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('ActionTypeResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'actionTypes/:Id',
      {Id: '@Id'},
      {}
    );
  }]);
