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
      settings.SERVER_ADDRESS + '/api/links/:Id',
      {Id: '@Id'},
      {
        'status': {url: settings.SERVER_ADDRESS + '/api/links/status', method: 'GET', isArray: true},
        'search': {
          url: settings.SERVER_ADDRESS + '/api/links/search/:Name',
          method: 'GET',
          params: {Name: '@Name'},
          isArray: true
        },
        'refresh': {url: settings.SERVER_ADDRESS + '/api/links/refresh/:Id', method: 'GET', params: {Id: '@Id'}},
        'update': {method: 'PUT'},
        'remove': {url: settings.SERVER_ADDRESS + '/api/links/remove', method: 'POST'},
        'addDownloadFromLink': {url: settings.SERVER_ADDRESS + '/api/links/addDownloadFromLink', method: 'POST'},
        'addDownloadsFromLinks': {url: settings.SERVER_ADDRESS + '/api/links/addDownloadsFromLinks', method: 'POST'}
      }
    );
  }
  ]);
