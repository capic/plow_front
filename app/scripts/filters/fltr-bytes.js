'use strict';

/**
 * @ngdoc filter
 * @name plowshareFrontApp.filter:fltrBytes
 * @function
 * @description
 * # fltrBytes
 * Filter in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .filter('bytesFltr', function () {
    return function (bytes, precision) {
      var returned = '';
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
        returned = '-';
      } else {
        if (typeof precision === 'undefined') {
          precision = 1;
        }

        if (bytes != 0) {

          var units = ['b', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

          returned = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
      }

      return returned;
    };
  });
