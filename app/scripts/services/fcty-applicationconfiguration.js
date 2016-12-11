'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.srvApplicationconfiguration
 * @description
 * # srvApplicationconfiguration
 * Service in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .factory('ApplicationConfigurationFcty', function () {
    var applicationConfiguration = {};

    return {
      getData: function() {
        return applicationConfiguration;
      },
      setData: function(newApplicationConfiguration) {
        applicationConfiguration = newApplicationConfiguration;
      }
    };
  });
