'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlManagelinksCtrl
 * @description
 * # CtrlManagelinksCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('AddLinksCtrl', ['$scope', 'listSeparatorDownloads', 'LinkResourceFctry', 'eventDownloadsLinksSrvi',
        function ($scope, listSeparatorDownloads, LinkResourceFctry, eventDownloadsLinksSrvi) {
            var that = this;

            // number of linked to add
            // this value will be decreased in the links controller
            $scope.nbrLinksToAdd = 0;

            $scope.progressbarValue = 0;

            $scope.links = {
                linksString: ''
            };

            $scope.addLinks = function() {
                if ($scope.links.linksString !== '') {
                    var tabLinks = [];
                    angular.forEach(listSeparatorDownloads, function (separator) {
                        if ($scope.links.linksString.indexOf(separator) >= 0) {
                            angular.forEach($scope.links.linksString.split(separator), function (link) {
                                tabLinks.push([link, separator]);
                            });
                        }
                    });

                    //the textarea is field but no separator found so use the full textarea
                    if (tabLinks.length === 0) {
                        tabLinks.push([$scope.links.linksString, '']);
                    }

                    $scope.nbrLinksToAdd = tabLinks.length;
                    $scope.nbrLinksTotalToAdd = $scope.nbrLinksToAdd;

                    angular.forEach(tabLinks, function(link) {
                        that.addLink(link);
                    });
                }
            };

            this.addLink = function(linkAndSeparator) {
                if (linkAndSeparator[0] !== '') {
                    var linkObject = new LinkResourceFctry();
                    linkObject.link = linkAndSeparator[0];

                    linkObject.$save(function(response) {
                            eventDownloadsLinksSrvi.addNewLinkToLinksList(response);
                            that.backAddLink(linkAndSeparator);
                        },
                        function() {
                            that.backAddLink(linkAndSeparator);
                        }
                    );
                }
            };

            this.backAddLink = function(linkAndSeparator) {
                $scope.nbrLinksToAdd--;
                $scope.probressbarValue = ($scope.nbrLinksTotalToAdd - $scope.nbrLinksToAdd) * 100 / $scope.nbrLinksTotalToAdd
                $scope.links.linksString = $scope.links.linksString.replace(linkAndSeparator[0] + linkAndSeparator[1], '');
                $scope.links.linksString = $scope.links.linksString.replace(linkAndSeparator[0], '');
            };
        }
    ]
);
