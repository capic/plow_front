'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctryApplicationConfiguration
 * @description
 * # fctryApplicationConfiguration
 * Service in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('ApplicationConfigurationResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'applicationConfiguration/:Id',
      {Id: '@Id'},
      {'update': {method: 'PUT'}}
    );
  }
  ]);
