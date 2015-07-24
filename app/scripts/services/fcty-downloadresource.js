'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyDownloadResource
 * @description
 * # fctyDownloadResource
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('DownloadResourceFctry', ['$resource', 'settings', function ($resource, settings) {
        return $resource(
                settings.SERVER_ADDRESS + '/api/downloads/:Id',
            {Id: '@Id'},
            {
                'status': {url: settings.SERVER_ADDRESS +'/api/downloads/status', method: 'GET', isArray : true},
                'search': {url: settings.SERVER_ADDRESS +'/api/downloads/search/:Name', method: 'GET', params:{Name: '@Name'}, isArray : true},
                'availability': {url: settings.SERVER_ADDRESS +'/api/downloads/availability/:Id',method: 'GET'},
                'refresh': {url: settings.SERVER_ADDRESS +'/api/downloads/refresh', method: 'GET', isArray : true},
                'refreshDownload': {url: settings.SERVER_ADDRESS +'/api/downloads/refresh/:Id', method: 'GET'},
                'update': {method: 'PUT'},
                'remove': {url: settings.SERVER_ADDRESS +'/api/downloads/remove', method: 'POST'},
                'start': {url: settings.SERVER_ADDRESS +'/api/downloads/start', method: 'POST', isArray : true},
                'stop': {url: settings.SERVER_ADDRESS +'/api/downloads/stop', method: 'POST', isArray : true},
              'import': {url: settings.SERVER_ADDRESS + '/api/downloads/import', method: 'POST', isArray: true},
              'infos': {url: settings.SERVER_ADDRESS + '/api/downloads/infos/:Id', method: 'GET'},
              'deleteInfos': {url: settings.SERVER_ADDRESS + '/api/downloads/infos', method: 'POST'}
            }
        );
  }]);
