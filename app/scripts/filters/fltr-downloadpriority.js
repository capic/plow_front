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
  .filter('downloadPriorityFltr', ['$translate', 'downloadPriorities', function ($translate, downloadPriorities) {
    return function (input) {
      if (input !== undefined) {
        var returned = '*unknown*';

        var priorityMatched = downloadPriorities.filter(function (priority) {
          return parseInt(priority.id) === parseInt(input);
        });

        if (priorityMatched.length === 1) {
          returned = priorityMatched[0].value;
        }

        return returned;
      }
    };
  }]);
