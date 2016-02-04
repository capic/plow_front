'use strict';

/**
 * @ngdoc filter
 * @name plowshareFrontApp.filter:fltrHostpicture
 * @function
 * @description
 * # fltrHostpicture
 * Filter in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .filter('hostPictureFltr', ['hostPicturesList', function (hostPicturesList) {
    return function (input) {
      var returned =  null;

      if (input != null) {
        var hostMatched = hostPicturesList.hosts.filter(function(host) {
          return host.id === parseInt(input);
        });

        if (hostMatched.length === 1) {
          returned = hostMatched[0].picture;
        }

      }

      return returned;
    };
  }]);
