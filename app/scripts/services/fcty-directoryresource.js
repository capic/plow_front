'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyLinkResource
 * @description
 * # fctyLinkResource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('DirectoryResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'directories/:Id',
      {Id: '@Id'},
      {}
    );
  }
  ]);
