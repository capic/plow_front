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
  .filter('downloadStatusFltr2', function (downloadStatusListValue) {
    return function (input) {
      var returned = '';

      var statusMatched = downloadStatusListValue.status.filter(function (statusValue) {
        return parseInt(statusValue.id) === parseInt(input);
       });

       if (statusMatched.length === 1) {
         returned = statusMatched[0].name;
       }

      return returned;
    };
  });
