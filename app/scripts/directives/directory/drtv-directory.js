'use strict';

/**
 * @ngdoc directive
 * @name plowshareFrontApp.directive:drtvDirectory
 * @description
 * # drtvDirectory
 */
angular.module('plowshareFrontApp')
  .directive('drtvDirectory', function () {
    return {
      scope: {},
      template: '',//'directives/directory/templates/directory.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the drtvDirectory directive');
      }
    };
  });
