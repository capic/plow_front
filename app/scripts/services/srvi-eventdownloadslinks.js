'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.srviEventDownloadsLinks
 * @description
 * # srviEventDownloadsLinks
 * Service in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .service('eventDownloadsLinksSrvi', ['$rootScope',
    function eventDownloadsLinksSrvi($rootScope) {
      return {
        addNewLinkToLinksList: function (newLink) {
          $rootScope.$broadcast('addNewLinkToLinksList', newLink);
        },
        addNewLinksToDownloadsList: function (newDownloadsList) {
          $rootScope.$broadcast('addNewLinksToDownloadsList', newDownloadsList);
        }
      };
    }
  ]
);
