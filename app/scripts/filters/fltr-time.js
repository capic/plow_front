'use strict';

/**
 * @ngdoc filter
 * @name plowshareFrontApp.filter:fltrTime
 * @function
 * @description
 * # fltrTime
 * Filter in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
    .filter('timeFltr', function () {
        return function(second) {
          if (second != null && second != "") {
            var hours = parseInt(second / 3600);
            var minutes = parseInt((second % 3600) / 60);
            var seconds = parseInt((second % 3600) % 60);

            return ((hours < 10) ? '0' + hours : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
          }
        };
  });
