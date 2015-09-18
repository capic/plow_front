'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyLinkResource
 * @description
 * # fctyLinkResource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('LinkResourceFctry', ['$resource', 'settings', function ($resource, settings) {
    return $resource(
      settings.SERVER_ADDRESS + 'links/:Id',
      {Id: '@Id'},
      {
        'status': {url: settings.SERVER_ADDRESS + 'links/status', method: 'GET', isArray: true},
        'search': {
          url: settings.SERVER_ADDRESS + 'links/search/:Name',
          method: 'GET',
          params: {Name: '@Name'},
          isArray: true
        },
        'refresh': {url: settings.SERVER_ADDRESS + 'links/refresh/:Id', method: 'GET', params: {Id: '@Id'}},
        'update': {method: 'PUT'},
        'remove': {url: settings.SERVER_ADDRESS + 'links/remove', method: 'POST'},
        'addDownloadFromLink': {url: settings.SERVER_ADDRESS + 'links/addDownloadFromLink', method: 'POST'},
        'addDownloadsFromLinks': {url: settings.SERVER_ADDRESS + 'links/addDownloadsFromLinks', method: 'POST'}
      }
    );
  }
  ]);
