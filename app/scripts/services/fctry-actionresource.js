'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.actionresource
 * @description
 * # actionresource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('ActionResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'actions/:Id',
      {Id: '@Id'},
      {
        'execute': {url: settings.SERVER_ADDRESS + 'actions/execute', method: 'POST'}
      }
    );
  }]);
