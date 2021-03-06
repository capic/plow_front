'use strict';

/**
 * @ngdoc filter
 * @name plowshareFrontApp.filter:fltrDownloadStatus
 * @function
 * @description
 * # fltrDownloadStatus
 * Filter in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
    .filter('downloadStatusFltr', function (downloadStatusListValue) {
        return function (input) {
            var returned =  '*unknown*';

            var statusMatched = downloadStatusListValue.status.filter(function(statusValue) {
                return statusValue.id === input;
            });

            if (statusMatched.length === 1) {
                returned = statusMatched[0].name;
            }

            return returned;
        };
  });
