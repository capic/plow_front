'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', '$filter', 'DownloadResourceFctry', 'DirectoryResourceFctry', 'downloadPriorities', 'download', '$wamp',
    function ($scope, $modalInstance, $translate, $filter, DownloadResourceFctry, DirectoryResourceFctry, downloadPriorities, download, $wamp) {
      function onevent(args) {
        var down = angular.fromJson(args[0]);

        $scope.download.size_file = down.size_file;
        $scope.download.size = down.size;
        $scope.download.size_file_downloaded = down.size_file_downloaded;
        $scope.download.size_part = down.size_part;
        $scope.download.size_part_downloaded = down.size_part_downloaded;
        $scope.download.progress_file = down.progress_file;
        $scope.download.progress_part = down.progress_part;
        $scope.download.status = down.status;
        $scope.download.current_speed = down.current_speed;
        $scope.download.time_left = down.time_left;
        $scope.download.time_spent = down.time_spent;
        $scope.download.theorical_start_datetime = down.theorical_start_datetime;

        if ($scope.startCounter == 0 && ($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
          $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
        }

        if (down.status == 3) { //TODO: utiliser une constante
          $wamp.unsubscribe('plow.downloads.download.' + download.id);
          $wamp.unsubscribe('plow.downloads.logs.' + download.id);
        }
      }

      function oneventLogs(args) {
        var downLogs = angular.fromJson(args[0]);
        $scope.download.logs += downLogs.logs;
      }

      $scope.download = download;
      $scope.download.logs = '';
      $scope.downloadPriorities = downloadPriorities;
      $scope.downloadPriority = {};
      $scope.startCounter = 0;
      $scope.downloadPriority.selected = $filter('filter')(downloadPriorities, {id: $scope.download.priority})[0];
      $scope.autoscroll = true;
      $scope.edition = {};
      $scope.edition.downloadDirectory = angular.copy($scope.download.download_directory);
      $scope.nbrDownloadsToFinishBeforeUnrar = 0;
      $scope.download.theorical_start_datetime = new Date($scope.download.theorical_start_datetime);
      $scope.download.fileExists = false; // par defaut on suppose que le fichier existe pas

      if (($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
        $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
      }

      $scope.listPath = DirectoryResourceFctry.query();
      $scope.path = {};

      $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        rowHeight: 35,
        rowTemplate: '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
        '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
        '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-danger\': !row.entity.fileExists }"  ui-grid-cell></div>' +
        '</div>',
        columnDefs: [
          {
            name: ' ',
            field: ' ',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 25
          },
          {
            name: 'name',
            displayName: 'Name',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false
          },
          {
            name: 'download_directory.path',
            displayName: 'Directory',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false
          },
          {
            name: 'status',
            displayName: 'Status',
            cellTooltip: true,
            headerCellFilter: 'translate',
            cellFilter: 'downloadStatusFltr2',
            enableCellEdit: false,
            width: 80
          }
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
        }
      };

      if ($scope.download.download_package != null) {
        DownloadResourceFctry.query({package_id: $scope.download.download_package.id},
          function (response) {
            $scope.gridOptions.data = response;

            angular.forEach(response, function(resp) {
              //TODO: use constants
              if (resp.status == 1 || resp.status == 2) {
                $scope.nbrDownloadsToFinishBeforeUnrar++;
              } else {
                var idx = $scope.gridOptions.data.indexOf(resp);
                if (resp.id == download.id) {
                  $scope.gridOptions.data[idx] = download;
                } else {
                  DownloadResourceFctry.exists({Id: resp.id}, function(ret) {
                    resp.fileExists = ret.return;

                    if (!resp.fileExists) {
                      $scope.nbrDownloadsToFinishBeforeUnrar++;
                    }
                    $scope.gridOptions.data[idx] = resp;
                  });
                }
              }
            });
          }
        );
      }

      DownloadResourceFctry.logs({Id: download.id},
        function (response) {
          if (response.logs != undefined && response.logs != '') {
            $scope.download.logs = response.logs;
            $wamp.subscribe('plow.downloads.download.' + download.id, onevent);
            $wamp.subscribe('plow.downloads.logs.' + download.id, oneventLogs);
          } else {
            $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
              $scope.download.logs = translation;
            });
          }
        }
      );

      if (download.status != 1 && download.status != 2)  {
        DownloadResourceFctry.exists({Id: download.id},
          function (response) {
            console.log(response.return);
            $scope.download.fileExists = response.return;
          }
        );
      }

      $scope.delete = function () {
        DownloadResourceFctry.deleteLogs({}, {id: download.id},
          function (response) {
            if (response.return == true) {
              $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
                $scope.download.infosPlowdown = translation;
              });
            }
          }, function () {
          });
      };

      $scope.ok = function () {
        $modalInstance.close($scope.edition.downloadDirectory);
      };

      $scope.$watch("downloadPriority.selected",
        function (newVal, oldVal) {
          if (newVal != oldVal) {
            DownloadResourceFctry.updatePriority({id: newVal});
          }
        }
      );

      $scope.unrar = function() {
        DownloadResourceFctry.unrar({id: download.id},
          function() {

          }
        );
      };

      $scope.processItem = function(tag){
        return {
          path:tag
        }
      };

      $scope.deleteOption  = function(directory) {
        if ($scope.listPath.length > 1) {
          DirectoryResourceFctry.delete({Id: directory.id}, function(response) {
            var idx = $scope.listPath.indexOf(directory);
            $scope.listPath.splice(idx, 1);
            $scope.edition.downloadDirectory = $scope.listPath[0];
          }, function(response) {
          });
        }
      }
    }
  ]
);
