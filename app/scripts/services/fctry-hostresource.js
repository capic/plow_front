'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctryHostpictureresource
 * @description
 * # fctryHostpictureresource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('HostResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'downloadHosts/:Id',
      {Id: '@Id'},
      {
        'update': {method: 'PUT'}
      }
    );
  }
  ]);
