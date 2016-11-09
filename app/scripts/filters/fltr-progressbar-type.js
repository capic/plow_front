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
  .filter('progressbarType', function () {
    return function (status) {
      var returned = 'success';

      switch(status) {
        case 1:
          returned = 'warning';
              break;
        case 2:
          returned = 'info';
              break;
        case 3:
          returned = 'success';
              break;
      }

      return returned;
    };
  });
