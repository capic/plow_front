'use strict';

/**
 * @ngdoc directive
 * @name plowshareFrontApp.directive:drtvDownloadstatus
 * @description
 * # drtvDownloadstatus
 */
angular.module('plowshareFrontApp')
  .directive('downloadStatusDrtv', function (downloadStatusListValue, $filter) {
    return {
      template: '<span></span>',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element/*, attrs*/) {
        scope.$watch('download', function () {
          if (scope.download !== undefined && scope.download.status !== undefined) {
            var i = 0;
            var found = false;
            var downloadStatusObject = null;
            while (i < downloadStatusListValue.status.length && !found) {
              var s = downloadStatusListValue.status[i];
              if (s.id == scope.download.status) {
                downloadStatusObject = s;
                found = true;
              }
              i++;
            }

            if (downloadStatusObject != null) {
              element.removeClass();
              element.addClass('label');
              switch (parseInt(downloadStatusObject.id, 10)) {
                case 1:
                  element.addClass('bg-warning');
                  element.attr('title', '')
                  break;
                case 2:
                  element.addClass('bg-success');
                  element.attr('title', '')
                  break;
                case 3:
                  element.addClass('bg-primary');
                  element.attr('title', '')
                  break;
                case 4:
                  element.addClass('bg-error');
                  element.attr('title', '')
                  break;
                case 5:
                  element.addClass('bg-light');
                  element.attr('title', '');
                  break;
              }

              element.html(downloadStatusObject.name);
            }
          }
        });
      }
    };
  });
