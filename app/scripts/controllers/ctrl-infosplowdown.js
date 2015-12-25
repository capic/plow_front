'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', '$filter', 'DownloadResourceFctry', 'DirectoryResourceFctry', 'HostPictureResourceFctry', 'ActionResourceFctry', 'downloadPriorities', 'download', '$wamp', 'settings', '$interval',
    function ($scope, $modalInstance, $translate, $filter, DownloadResourceFctry, DirectoryResourceFctry, HostPictureResourceFctry, ActionResourceFctry, downloadPriorities, download, $wamp, settings, $interval) {
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
        $scope.download.theorical_start_datetime = new Date(down.theorical_start_datetime);
        $scope.download.to_move_download_directory = down.to_move_download_directory;
        $scope.download.download_directory = down.download_directory;

        if ($scope.startCounter == 0 && $scope.download.theorical_start_datetime != undefined &&
          $scope.download.theorical_start_datetime != null &&
          ($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
          $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
        }

        if (down.status == 3 || down.status == 10) { //TODO: utiliser une constante
          $scope.edition.directory = $scope.download.download_directory;
        }
      }

      function oneventLogs(args) {
        var downLogs = angular.fromJson(args[0]);
        $scope.download.logs.logs += downLogs.logs;
      }

      function onEventPackageUnrar(args) {
        var packageUnrar = angular.fromJson(args[0]);
        $scope.download.download_package.unrar_progress = packageUnrar.unrar_progress;
      }

      $scope.download = download;
      $scope.download.logs = {};
      $scope.downloadPriorities = downloadPriorities;
      $scope.downloadPriority = {};
      $scope.startCounter = 0;
      $scope.downloadPriority.selected = $filter('filter')(downloadPriorities, {id: $scope.download.priority})[0];
      $scope.autoscroll = true;
      $scope.edition = {};
      $scope.nbrDownloadsToFinishBeforeUnrar = 0;
      $scope.download.theorical_start_datetime = new Date($scope.download.theorical_start_datetime);
      $scope.download.fileExists = false; // par defaut on suppose que le fichier existe pas

      if ($scope.download.theorical_start_datetime != undefined &&
        $scope.download.theorical_start_datetime != null &&
        ($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
        $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
      }

      DirectoryResourceFctry.query(
        function (response) {
          $scope.listPath = response;
          var tabResult = $filter('filter')(response, {id: $scope.download.directory.id}, true);
          if (tabResult.length > 0) {
            $scope.edition.directory = tabResult[0];
          }
        }
      );
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

      $scope.gridActions = {
        treeRowHeaderAlwaysVisible: false,
        rowHeight: 35,
        columnDefs: [
          {
            name: 'action_type.id',
            grouping: {groupPriority: 0},
            visible: false
          },
          {
            name: 'name__',
            displayName: 'Name',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false,
            width: 150,
            cellTemplate: '<div>' +
            '{{grid.appScope.name__(grid, row)}}' +
            '</div>'
          },
          {
            name: 'property_value',
            displayName: 'Value',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false,
            cellTemplate: '<div data-ng-if="row.entity.directory_id == null || row.entity.directory_id == undefined">' +
            ' {{row.entity.property_value}}' +
            '</div>' +
            '<div data-ng-if="row.entity.directory_id != null && row.entity.directory_id != undefined">' +
            ' {{row.entity.directory.path}}' +
            '</div>'

          },
          {
            name: 'action_status.name',
            displayName: 'Status',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false,
            width: 80,
            cellTemplate: '<div>' +
            '{{grid.appScope.status__(grid, row)}}' +
            '</div>'
          },
          {
            name: 'date__',
            displayName: 'Date',
            cellTooltip: true,
            headerCellFilter: 'translate',
            enableCellEdit: false,
            width: 150,
            cellTemplate: '<div>' +
            '{{grid.appScope.date__(grid, row)}}' +
            '</div>'
          }
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          // call resize every 200 ms for 2 s after modal finishes opening - usually only necessary on a bootstrap modal
          $interval(function () {
            $scope.gridApi.core.handleWindowResize();
          }, 10, 500);
        }
      };

      $scope.name__ = function (grid, row, col) {
        if (row.treeLevel == 0) {
          if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
            var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
            return entity.action_type.name;
          }
          else if (row.treeNode.children[0]) {
            var entity = row.treeNode.children[0].row.entity;
            return entity.action_type.name;
          }

          return row.entity.action_type.name;
        } else {
          if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
            var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
            return entity.property.name;
          }
          else if (row.treeNode.children[0]) {
            var entity = row.treeNode.children[0].row.entity;
            return entity.property.name;
          }

          return row.entity.property.name;
        }
      };

      $scope.status__ = function (grid, row, col) {
        if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
          var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
          return entity.action_status.name;
        }
        else if (row.treeNode.children[0]) {
          var entity = row.treeNode.children[0].row.entity;
          return entity.action_status.name;
        }

        return row.entity.action_status.name;
      };

      $scope.date__ = function (grid, row, col) {
        if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
          var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
          return entity.lifecycle_insert_date;
        }
        else if (row.treeNode.children[0]) {
          var entity = row.treeNode.children[0].row.entity;
          return entity.lifecycle_insert_date;
        }

        return row.entity.lifecycle_insert_date;
      };

      var websocketPackageUnrar = null;
      if ($scope.download.download_package != null) {
        DownloadResourceFctry.query({package_id: $scope.download.download_package.id},
          function (response) {
            $scope.gridOptions.data = response;

            $wamp.subscribe('plow.downloads.download.unrar.' + download.package_id, onEventPackageUnrar)
              .then(function (subscription) {
                websocketPackageUnrar = subscription;
              });

            angular.forEach(response, function (resp) {
              //TODO: use constants
              if (resp.status == 1 || resp.status == 2) {
                $scope.nbrDownloadsToFinishBeforeUnrar++;
              } else {
                var idx = $scope.gridOptions.data.indexOf(resp);
                if (resp.id == download.id) {
                  $scope.gridOptions.data[idx] = download;
                } else {
                  DownloadResourceFctry.exists({Id: resp.id}, function (ret) {
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

      var websocketDownload = null;
      var websocketDownloadLogs = null;
      DownloadResourceFctry.logs({Id: download.id},
        function (response) {
          if (response.logs != undefined && response.logs != '') {
            $scope.download.logs = response;
            $wamp.subscribe('plow.downloads.download.' + download.id, onevent)
              .then(function (subscription) {
                websocketDownload = subscription;
              });
            $wamp.subscribe('plow.downloads.logs.' + download.id, oneventLogs)
              .then(function (subscription) {
                websocketDownloadLogs = subscription;
              });
          } else {
            $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
              $scope.download.logs.logs = translation;
            });
          }
        }
      );

      ActionResourceFctry.query({download_id: download.id},
        function (response) {
          $scope.gridActions.data = response;
        }
      );

      //TODO: utiliser des constantes
      if (download.status != 1 && download.status != 2) {
        $scope.edition.directory = angular.copy($scope.download.download_directory);
        $scope.test = {};
        $scope.downloadFileExistsPromise = DownloadResourceFctry.exists({Id: download.id},
          function (response) {
            $scope.download.fileExists = response.return;
          }
        );
      }

      $scope.delete = function () {
        DownloadResourceFctry.deleteLogs({Id: download.id},
          function (response) {
            if (response.logs == '') {
              $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
                $scope.download.logs = translation;
              });
            }
          }, function () {
          });
      };

      $scope.ok = function () {
        if (websocketDownload != null) {
          $wamp.unsubscribe(websocketDownload);
        }

        if (websocketDownloadLogs != null) {
          $wamp.unsubscribe(websocketDownloadLogs);
        }

        if (websocketPackageUnrar != null) {
          $wamp.unsubscribe(websocketPackageUnrar);
        }
        $modalInstance.close($scope.edition.directory);
      };

      $scope.$watch("downloadPriority.selected",
        function (newVal, oldVal) {
          if (newVal != oldVal) {
            DownloadResourceFctry.updatePriority({id: newVal});
          }
        }
      );

      $scope.unrar = function () {
        DownloadResourceFctry.unrar({id: download.id},
          function () {

          }
        );
      };

      $scope.processItem = function (tag) {
        return {
          path: tag
        }
      };

      $scope.deleteOption = function (directory) {
        if ($scope.listPath.length > 1) {
          DirectoryResourceFctry.delete({Id: directory.id}, function (response) {
            var idx = $scope.listPath.indexOf(directory);
            $scope.listPath.splice(idx, 1);
            $scope.edition.directory = $scope.listPath[0];
          }, function (response) {
          });
        }
      };

      $scope.deletePackageFiles = function () {
        DownloadResourceFctry.deletePackageFiles({id: download.package_id},
          function () {
          },
          function () {
          }
        );
      };
    }
  ]
);
