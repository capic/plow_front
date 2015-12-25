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
        'bulk': {url: settings.SERVER_ADDRESS + 'actions/bulk', method: 'POST', isArray: true}
      }
    );
  }]);
