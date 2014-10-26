'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.srviEventNotifications
 * @description
 * # srviEventNotifications
 * Service in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .service('eventNotificationsSrvi', ['$rootScope',
    function eventNotificationsSrvi($rootScope) {
      return {
        addNewActionInProgress: function () {
          $rootScope.$broadcast('addNewActionInProgress');
        },
        removeNewActionInProgress: function () {
          $rootScope.$broadcast('removeNewActionInProgress');
        }
      };
    }
  ]
);
