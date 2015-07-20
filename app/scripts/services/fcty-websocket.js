'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyWebSocket
 * @description
 * # fctyWebSocket
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('webSocketFcty', ['$q', '$rootScope', 'settings', '$filter',
    function ($q, $rootScope, settings, $filter) {
      var Service = {};

      var currentNotificationId = 0;
      var notifications = [];

      var ws = new WebSocket(settings.SERVER_NOTIFICATION);

      ws.onopen = function () {
        console.log("Socket has been opened!");
      };

      ws.onmessage = function (message) {
        listener(JSON.parse(message.data));
      };

      function listener(data) {
        var messageObj = data;
        console.log("Received data from websocket: ", messageObj);

        notifications.push({id: currentNotificationId, message: messageObj, new: true});
        currentNotificationId++;
      }

      Service.getAllNotifications = function () {
        return notifications;
      };

      Service.getNewNotifications = function () {
        var newNotifications = $filter('filter')(notifications, {new: true}, true);
        return newNotifications;
      };

      Service.getOldNotifications = function () {
        return $filter('filter')(notifications, {new: false}, true);
      };

      Service.delete = function (idCallback) {
        var found = false;
        var i = 0;

        while (i < notifications.length && !found) {
          if (notifications[i].id === idCallback) {
            notifications.splice(i, 1);
            found = true;

            if (notifications.length == 0) {
              currentNotificationId = 0;
            }
          }

          i++;
        }
      };

      Service.clear = function () {
        notifications.length = 0;
      };

      Service.markedAsOld = function () {
        angular.forEach(notifications, function (message) {
          message.new = false;
        });
      };

      return Service;
    }
  ]
);
