'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlTasksinprogressCtrl
 * @description
 * # CtrlTasksinprogressCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('tasksInProgressCtrl', ['$scope', 'tasksManagementFcty',
    function ($scope, tasksManagementFcty) {
      $scope.tasksInProgress = tasksManagementFcty.getTasksList();
    }
  ]
);
