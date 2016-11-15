'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyDownloadResource
 * @description
 * # fctyDownloadResource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('DownloadResourceFctry', ['$resource', 'settings',
    function ($resource, settings) {
      return $resource(
        settings.SERVER_ADDRESS + 'downloads/:Id',
        {Id: '@Id'},
        {
          'status': {url: settings.SERVER_ADDRESS + 'downloads/status', method: 'GET', isArray: true},
          'search': {
            url: settings.SERVER_ADDRESS + 'downloads/search/:Name',
            method: 'GET',
            params: {Name: '@Name'},
            isArray: true
          },
          'deleteFinished': {url: settings.SERVER_ADDRESS + 'downloads/finished', method: 'POST'},
          'availability': {url: settings.SERVER_ADDRESS + 'downloads/availability/:Id', method: 'GET'},
          'refresh': {url: settings.SERVER_ADDRESS + 'downloads/refresh', method: 'GET', isArray: true},
          'refreshDownload': {url: settings.SERVER_ADDRESS + 'downloads/refresh/:Id', method: 'GET'},
          'update': {method: 'PUT'},
          'remove': {url: settings.SERVER_ADDRESS + 'downloads/remove', method: 'POST'},
          'resume': {url: settings.SERVER_ADDRESS + 'downloads/resume', method: 'POST'},
          'start': {url: settings.SERVER_ADDRESS + 'downloads/start', method: 'POST'},
          'pause': {url: settings.SERVER_ADDRESS + 'downloads/pause', method: 'POST'},
          'stop': {url: settings.SERVER_ADDRESS + 'downloads/stop', method: 'POST', isArray: true},
          'import': {url: settings.SERVER_ADDRESS + 'downloads/import', method: 'POST', isArray: true},
          "logs": {url: settings.SERVER_ADDRESS + 'downloads/logs/:Id', method: 'GET'},
          "deleteLogs": {url: settings.SERVER_ADDRESS + 'downloads/logs/:Id', method: 'DELETE'},
          'updatePriority': {url: settings.SERVER_ADDRESS + 'downloads/priority', method: 'POST'},
          'move': {url: settings.SERVER_ADDRESS + 'downloads/moveOne', method: 'POST'},
          'unrar': {url: settings.SERVER_ADDRESS + 'downloads/unrar', method: 'POST'},
          'exists': {url: settings.SERVER_ADDRESS + 'downloads/file/exists/:Id', method: 'GET'},
          'reset': {url: settings.SERVER_ADDRESS + 'downloads/reset', method: 'POST'},
          'deletePackageFiles': {url: settings.SERVER_ADDRESS + 'downloads/package/files/delete', method: 'POST'}
        }
      );
    }
  ]
);
