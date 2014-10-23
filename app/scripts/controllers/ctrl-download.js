'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('DownloadCtrl', ['$scope', 'DownloadResourceFctry', 'downloadStatusListValue',
        function ($scope, DownloadResourceFctry, downloadStatusListValue) {
            // the list of downloads
            $scope.downloadsList = [];
            // tab for the animate refresh icon
            $scope.downloadRefreshInProgress = [];

            // get the status list for the column status
            downloadStatusListValue.status = DownloadResourceFctry.status(function() {
                $scope.downloadsList = DownloadResourceFctry.query();
            });

            // to refresh all downloads list
            $scope.refresh = function() {
                $scope.downloadsList = DownloadResourceFctry.refresh();
            };

            // to refresh only one download
            $scope.refreshDownload = function(entity) {
                $scope.downloadRefreshInProgress[entity.id] = 'glyphicon-refresh-animate';

                DownloadResourceFctry.refreshDownload({'Id': entity.id}, function(response) {
                    var idx = $scope.downloadsList.indexOf(entity);
                    $scope.downloadsList[idx] = response;

                    $scope.downloadRefreshInProgress[entity.id] = '';
                });
            };

            // to start to import the links from the log
            $scope.import = function() {
                $scope.downloadsList = DownloadResourceFctry.import();
            };

            // to delete a download
            $scope.deleteDownload = function(entity) {
                DownloadResourceFctry.delete({Id: entity.id}, function(response) {
                    if(response.status === true) {
                        var idx = $scope.downloadsList.indexOf(entity);
                        $scope.downloadsList.splice(idx, 1);
                    }
                });
            };

            // to delete the selected downloads
            $scope.deleteSelectedDownload = function() {
                var selectedDownloadsList = $scope.downloadsList.filter(
                    function(download){
                        return download.hasOwnProperty('selected') && download.selected === true;
                    }
                );
                var selectedIds = [];
                angular.forEach(selectedDownloadsList, function(entity) {
                    selectedIds.push(entity.id);
                });

                DownloadResourceFctry.remove({ListId: selectedIds}, function(response) {
                    if(response.status === true) {
                        angular.forEach(selectedDownloadsList, function(entity) {
                            var idx = $scope.downloadsList.indexOf(entity);
                            $scope.downloadsList.splice(idx, 1);
                        });
                    }
                });
            };

            // to start downloading
            $scope.startDownloading = function(entity) {
                DownloadResourceFctry.start({}, {id: entity.id}, function (response) {
                    var idx = $scope.downloadsList.indexOf(entity);

                    $scope.downloadsList[idx] = response[0];
                });
            };

            // to stop donwloading
            $scope.stopDownloading = function(entity) {
                DownloadResourceFctry.stop({id: entity.id}, function(response) {
                    var idx = $scope.downloadsList.indexOf(entity);

                    $scope.downloadsList[idx] = response[0];
                });
            };

            // when the add new download event is fired
            $scope.$on('newDownload', function(event, newDownload) {
                $scope.downloadsList.push(newDownload);
            });

            $scope.selectAllDownload = function(checkAll) {
                angular.forEach($scope.downloadsList, function(download) {
                    download.selected = checkAll;
                });
            };
  }]);
