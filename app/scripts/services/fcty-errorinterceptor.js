'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyErrorinterceptor
 * @description
 * # fctyErrorinterceptor
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('ErrorInterceptorFcty', ['$q', '$injector', 'ngToast', function ($q, $injector, ngToast) {
    return {
      'responseError': function (response) {
        if (response != null && response != undefined && response.data != null) {
          ngToast.danger({content: response.data.message});

          return $q.reject(response);
        }
      }
    }
  }]);
