'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlLinkCtrl
 * @description
 * # CtrlLinkCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
    .controller('LinkCtrl', ['$scope', 'linkStatusListValue', 'LinkResourceFctry',
        function ($scope, linkStatusListValue, LinkResourceFctry) {
            var that = this;

            // the list of links in the database displayed in the grid
            $scope.linksList = [];

            // get the list of status
            linkStatusListValue.status = LinkResourceFctry.status(function() {
                $scope.linksList = LinkResourceFctry.query();
            });

            $scope.$on('addNewLinkToLinksList', function(events, newLink) {
                $scope.linksList.push(newLink);
            });

            $scope.deleteSelectedLinks = function() {
                var selectedLinksList = $scope.linksList.filter(
                    function (link) {
                        return link.hasOwnProperty('selected') && link.selected === true;
                    }
                );
                var selectedIds = [];
                angular.forEach(selectedLinksList, function (entity) {
                    selectedIds.push(entity.id);
                });

                LinkResourceFctry.remove({ListId: selectedIds}, function (response) {
                    if (response.status === true) {
                        angular.forEach(selectedLinksList, function (entity) {
                            var idx = $scope.linksList.indexOf(entity);
                            $scope.linksList.splice(idx, 1);
                        });
                        $scope.checkAll = false;
                    }
                });
            };

            $scope.deleteLink = function(entity) {
                //var dlg = dialogs.confirm('Confirm the deleting');
                //dlg.result.then(function(){
                    LinkResourceFctry.delete({Id: entity.id}, function(response) {
                        if (response.status === true) {
                            var idx = $scope.linksList.indexOf(entity);
                            $scope.linksList.splice(idx, 1);
                        }
                    });
//                },function(){
//                    //do nothing
//                });
            };

            $scope.selectAllLinks = function(checkAll) {
                angular.forEach($scope.linksList, function(link) {
                    link.selected = checkAll;
                });
            };
        }
    ]
);
