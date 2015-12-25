'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctryHostpictureresource
 * @description
 * # fctryHostpictureresource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('HostPictureResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'downloadHostPictures/:Id',
      {Id: '@Id'},
      {}
    );
  }
  ]);
