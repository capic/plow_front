'use strict';

/**
 * @ngdoc service
 * @name plowshareFrontApp.srviTasksManagement
 * @description
 * # srviTasksManagement
 * Service in the plowshareFrontApp.
 */
angular.module('plowshareFrontApp')
  .service('tasksManagementFcty', ['$filter',
    function tasksManagementFcty($filter) {
      var factory = {};

      factory.tasksList = [];

      factory.addTask = function (taskName, taskValue) {
        taskValue = taskValue || '';

        var taskId = null;

        if (taskName !== '') {
          var tasks = $filter('filter')(factory.tasksList, {name: taskName, value: taskValue}, true);

          if (tasks.length === 0) {
            taskId = factory.tasksList.length;
            factory.tasksList.push({id: taskId, name: taskName, value: taskValue});
          }
        }

        return taskId;
      };

      factory.removeTask = function (taskId) {
        var i = 0,
          found = false;

        while (i < factory.tasksList.length && found === false) {
          if (factory.tasksList[i].id === taskId) {
            found = true;
            factory.tasksList.splice(i, 1);
          }
          i++;
        }
      };

      factory.getTasksList = function () {
        return factory.tasksList;
      };

      return factory;
    }
  ]
);
