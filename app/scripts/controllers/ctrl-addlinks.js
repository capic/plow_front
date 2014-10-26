'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:AddLinksCtrl
 * @description
 * # AddLinksCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('AddLinksCtrl', ['$scope', 'listSeparatorDownloads', 'LinkResourceFctry', 'eventDownloadsLinksSrvi', 'eventNotificationsSrvi',
    function ($scope, listSeparatorDownloads, LinkResourceFctry, eventDownloadsLinksSrvi, eventNotificationsSrvi) {
      var that = this;

      // number of linked to add
      $scope.nbrLinksToAdd = 0;

      $scope.progressbarValue = 0;

      $scope.links = {
        linksString: ''
      };

      /**
       * function used to add all links
       */
      $scope.addLinks = function () {
        if ($scope.links.linksString !== '') {
          eventNotificationsSrvi.addNewActionInProgress();
          var tabLinks = [];
          angular.forEach(listSeparatorDownloads, function (separator) {
            if ($scope.links.linksString.indexOf(separator) >= 0) {
              angular.forEach($scope.links.linksString.split(separator), function (link) {
                if (link !== '') {
                  tabLinks.push([link, separator]);
                }
              });
            }
          });

          //the textarea is field but no separator found so use the full textarea
          if (tabLinks.length === 0) {
            tabLinks.push([$scope.links.linksString, '']);
          }

          $scope.nbrLinksToAdd = tabLinks.length;
          $scope.nbrLinksTotalToAdd = $scope.nbrLinksToAdd;

          angular.forEach(tabLinks, function (link) {
            that.addLink(link);
          });
        }
      };

      /**
       * function used to add a link to the database
       *
       * @param linkAndSeparator
       *  the link and the separator from the textarea
       */
      this.addLink = function (linkAndSeparator) {
        if (linkAndSeparator[0] !== '') {
          var linkObject = new LinkResourceFctry();
          linkObject.link = linkAndSeparator[0];

          linkObject.$save(
            //success
            function (response) {
              // fire a broadcast event to change the list of links in the links view
              eventDownloadsLinksSrvi.addNewLinkToLinksList(response);
              that.backAddLink(linkAndSeparator);
            },
            //error
            function () {
              that.backAddLink(linkAndSeparator);
            }
          );
        }
      };

      /**
       * function fired when the server respond after add link action
       * decreased the number of links to add
       * change the progress bar value
       * delete the link and the separator in the textarea
       *
       * @param linkAndSeparator
       *  the link and the separator from the textarea
       */
      this.backAddLink = function (linkAndSeparator) {
        $scope.nbrLinksToAdd--;
        $scope.progressbarValue = ($scope.nbrLinksTotalToAdd - $scope.nbrLinksToAdd) * 100 / $scope.nbrLinksTotalToAdd;
        $scope.links.linksString = $scope.links.linksString.replace(linkAndSeparator[0] + linkAndSeparator[1], '');

        if ($scope.nbrLinksToAdd === 0) {
          $scope.progressbarValue = 0;
          // the last entry maybe has no separator
          $scope.links.linksString = $scope.links.linksString.replace(linkAndSeparator[0], '');

          // force the textarea to be empty
          $scope.links.linksString = '';

          eventNotificationsSrvi.removeNewActionInProgress();
        }
      };
    }
  ]
);
