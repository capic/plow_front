'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlLinkCtrl
 * @description
 * # CtrlLinkCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('LinkCtrl', ['$scope', 'linkStatusListValue', 'LinkResourceFctry', 'eventDownloadsLinksSrvi', 'tasksManagementFcty',
    function ($scope, linkStatusListValue, LinkResourceFctry, eventDownloadsLinksSrvi, tasksManagementFcty) {
      var that = this;

      // the list of links in the database displayed in the grid
      $scope.linksList = [];

      var taskId = tasksManagementFcty.addTask('notifications.tasks.linkCtrl.GET_LINK_STATUS');
      // get the list of status
      linkStatusListValue.status = LinkResourceFctry.status(function () {
        tasksManagementFcty.removeTask(taskId);
        taskId = tasksManagementFcty.addTask('notifications.tasks.linkCtrl.GET_LINKS');
        LinkResourceFctry.query(function (response) {
          $scope.linksList = response;
          tasksManagementFcty.removeTask(taskId);
        });
      });

      $scope.$on('addNewLinkToLinksList', function (events, newLink) {
        $scope.linksList.push(newLink);
      });

      $scope.deleteSelectedLinks = function () {
        var taskId = tasksManagementFcty.addTask('notifications.tasks.linkCtrl.DELETE_SELECTED_LINKS');

        var selectedLinksList = that.getSelectedLinks();
        var selectedIds = that.getLinkIdListFromLinksList(selectedLinksList);

        LinkResourceFctry.remove({ListId: selectedIds}, function (response) {
          if (response.status === true) {
            angular.forEach(selectedLinksList, function (entity) {
              var idx = $scope.linksList.indexOf(entity);
              $scope.linksList.splice(idx, 1);
            });
            $scope.checkAll = false;
            tasksManagementFcty.removeTask(taskId);
          }
        });
      };

      $scope.deleteLink = function (entity) {
        //var dlg = dialogs.confirm('Confirm the deleting');
        //dlg.result.then(function(){
        var taskId = tasksManagementFcty.addTask('notifications.tasks.linkCtrl.DELETE_LINK');

        LinkResourceFctry.delete({Id: entity.id}, function (response) {
          if (response.status === true) {
            var idx = $scope.linksList.indexOf(entity);
            $scope.linksList.splice(idx, 1);

            tasksManagementFcty.removeTask(taskId);
          }
        });
//                },function(){
//                    //do nothing
//                });
      };

      $scope.refreshLink = function (entity, selected) {
        entity.refreshInProgress = 'glyphicon-refresh-animate';

        LinkResourceFctry.refresh({'Id': entity.id}, function (response) {
          var idx = $scope.linksList.indexOf(entity);
          response.selected = selected;
          $scope.linksList[idx] = response;

          entity.refreshInProgress = '';
        });
      };

      $scope.refreshSelectedLinks = function () {
        var selectedLinksList = that.getSelectedLinks();
        angular.forEach(selectedLinksList, function (link) {
          $scope.refreshLink(link, true);
        });
      };

      $scope.selectAllLinks = function (checkAll) {
        angular.forEach($scope.linksList, function (link) {
          link.selected = checkAll;
        });
      };

      $scope.addLinkToDownloadsList = function (link) {
        var taskId = tasksManagementFcty.addTask('notifications.tasks.linkCtrl.ADD_LINK_TO_DOWNLOADS_LIST');

        var linkObject = new LinkResourceFctry();
        linkObject.id = link.id;

        linkObject.$addDownloadFromLink(function (response) {
            var idx = $scope.linksList.indexOf(link);
            $scope.linksList.splice(idx, 1);

            eventDownloadsLinksSrvi.addNewLinksToDownloadsList([response]);

            tasksManagementFcty.removeTask(taskId);
          },
          function () {
          });
      };

      $scope.addSelectedLinksToDownloadsList = function () {
        //eventNotificationsSrvi.addNewActionInProgress();

        var selectedLinksList = that.getSelectedLinks();
        var selectedLinkIdList = that.getLinkIdListFromLinksList(selectedLinksList);

        LinkResourceFctry.addDownloadsFromLinks({ListId: selectedLinkIdList}, function (response) {
          that.backAddLinksToDownloadList(response);
        });
      };

      $scope.addAllLinksToDownloadsList = function () {
        //eventNotificationsSrvi.addNewActionInProgress();

        var allLinkIdList = that.getLinkIdListFromLinksList($scope.linksList);

        LinkResourceFctry.addDownloadsFromLinks({ListId: allLinkIdList}, function (response) {
          that.backAddLinksToDownloadList(response);
        });
      };

      this.backAddLinksToDownloadList = function (response) {
        eventDownloadsLinksSrvi.addNewLinksToDownloadsList(response.downloads);

        angular.forEach(response.linksId, function (linkId) {
          var idx = 0;
          var found = false;
          while (idx < $scope.linksList.length && found === false) {
            if ($scope.linksList[idx].id === linkId) {
              found = true;
              $scope.linksList.splice(idx, 1);
            }

            idx++;
          }
        });

        //eventNotificationsSrvi.removeNewActionInProgress();
      };

      this.getSelectedLinks = function () {
        var selectedLinksList = $scope.linksList.filter(
          function (link) {
            return link.hasOwnProperty('selected') && link.selected === true;
          }
        );

        return selectedLinksList;
      };

      this.getLinkIdListFromLinksList = function (linksList) {
        var linkIdList = [];
        angular.forEach(linksList, function (link) {
          linkIdList.push(link.id);
        });

        return linkIdList;
      }
    }
  ]
);
