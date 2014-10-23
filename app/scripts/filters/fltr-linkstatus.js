'use strict';

/**
 * @ngdoc filter
 * @name plowshareFrontApp.filter:fltrLinkStatus
 * @function
 * @description
 * # fltrLinkStatus
 * Filter in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
    .filter('linkStatusFltr', ['linkStatusListValue', function (linkStatusListValue) {
        return function (input) {
            var returned = '*unknown*';

            var statusMatched = linkStatusListValue.status.filter(function(statusValue) {
                return statusValue.id === input;
            });

            if (statusMatched.length === 1) {
                returned = statusMatched[0].name;
            }

            return returned;
        };
  }]);
