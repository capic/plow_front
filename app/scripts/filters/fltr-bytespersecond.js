'use strict';

/**
 * @ngdoc filter
 * @name plowshareFrontApp.filter:fltrBytesPerSecond
 * @function
 * @description
 * # fltrBytesPerSecond
 * Filter in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
    .filter('bytesPerSecondFltr', function () {
        return function(bytes, precision) {
            var returned = '';

            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)){
                returned = '-';
            } else {
                if (typeof precision === 'undefined') {
                    precision = 1;
                }

                var units = ['b/s', 'kB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'],
                    number = Math.floor(Math.log(bytes) / Math.log(1024));

                returned = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
            }

            return returned;
        };
  });
