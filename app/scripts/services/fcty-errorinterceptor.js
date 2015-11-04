'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.fctyErrorinterceptor
 * @description
 * # fctyErrorinterceptor
 * Factory in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('ErrorInterceptorFcty', ['$q', '$injector', function ($q, $injector) {
    /*function openErrorDialog(response){
     $injector.get('$dialog').dialog({
     backdropFade: true,
     dialogFade: true,
     dialogClass: 'modal newCustomerModal',
     resolve: {
     errorData: function () {
     return response.data;
     },
     errorStatus: function () {
     return response.status;
     }
     }
     })
     .open('/views/error-dialog-partial.htm',
     'errorDialogController')
     .then(function (response) {
     if (response) {
     window.location = '/';
     }
     });
     }

     function success(response) {
     return response;
     }

     function error(response) {
     /!*var isAuthRequest = (response.config.url.indexOf('/v1/rest/auth') !== -1);

     //if we are on the authenticating don't open the redirect dialog
     if(isAuthRequest){
     return $q.reject(response);
     }*!/

     //open dialog and return rejected promise
     openErrorDialog(response);
     return $q.reject(response);
     }

     return function (promise) {
     return promise.then(success, error);
     };*/

    return {
      'responseError': function (response) {
        return $q.reject(response);
      }
    }
  }]);
