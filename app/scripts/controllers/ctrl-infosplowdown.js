'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', '$filter', '$modal', 'DownloadResourceFctry', 'DirectoryResourceFctry', 'HostPictureResourceFctry', 'ActionResourceFctry', 'downloadPriorities', 'download', '$wamp', 'settings', '$interval', 'ApplicationConfigurationFcty',
      function ($scope, $modalInstance, $translate, $filter, $modal, DownloadResourceFctry, DirectoryResourceFctry, HostPictureResourceFctry, ActionResourceFctry, downloadPriorities, download, $wamp, settings, $interval, ApplicationConfigurationFcty) {
        $scope.contextMenuEntity = {};

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
          $scope.download.directory = down.directory;

          if ($scope.startCounter == 0 && $scope.download.theorical_start_datetime != undefined &&
            $scope.download.theorical_start_datetime != null &&
            ($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
            $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
          }

          if (down.status == 3 || down.status == 10) { //TODO: utiliser une constante
            $scope.edition.directory = $scope.download.directory;
          }
        }

        function oneventLogs(args, kargs) {
          var event = angular.fromJson(kargs);

          if (event.target == "downloadLog") {

            switch (event.action) {
              case "add":
                $scope.download.logs += event.data[0].logs + '\r\n';
                break;
            }
          }
        }

        function onEventAction(actionsListJson) {
          var actionsList = angular.fromJson(actionsListJson);

          angular.forEach(actionsList, function (action) {
            var tabProperties = flattenActionProperties(action);
            actionsFormattedForExecutionList.push(prepareActionToExecution(action));

            angular.forEach(tabProperties, function (prop) {
              var iterator = 0;
              var found = false;

              while (iterator < $scope.gridActions.data.length && !found) {
                if (parseInt(prop.action_id) === parseInt($scope.gridActions.data[iterator].action_id) && parseInt(prop.property_id) === parseInt($scope.gridActions.data[iterator].property_id)) {
                  $scope.gridActions.data[iterator] = prop;
                  found = true;
                }
                iterator++
              }

              if (!found) {
                $scope.gridActions.data.push(prop);
              }
            });
          });
        }

        $scope.download = download;
        // $scope.download.logs = {};
        $scope.downloadPriorities = downloadPriorities;
        $scope.downloadPriority = {};
        $scope.startCounter = 0;
        $scope.downloadPriority.selected = $filter('filter')(downloadPriorities, {id: $scope.download.priority})[0];
        $scope.autoscroll = true;
        $scope.edition = {};
        $scope.nbrDownloadsToFinishBeforeUnrar = 0;
        $scope.download.theorical_start_datetime = new Date($scope.download.theorical_start_datetime);
        $scope.download.fileExists = false; // par defaut on suppose que le fichier existe pas
        var actionsFormattedForExecutionList = [];

        if ($scope.download.theorical_start_datetime != undefined &&
          $scope.download.theorical_start_datetime != null &&
          ($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
          $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
        }

        $scope.directoryQueryPromise = DirectoryResourceFctry.query(
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
              name: 'directory.path',
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

            $interval(function () {
              $scope.gridApi.core.handleWindowResize();
            }, 10, 500);
          }
        };

        $scope.gridActions = {
          treeRowHeaderAlwaysVisible: false,
          rowHeight: 45,
          rowTemplate: 'views/downloads/infos/menu/rowTemplate.html',
          columnDefs: [
            {
              name: 'action_id',
              grouping: {groupPriority: 0},
              visible: false
            },
            {
              name: 'action_type_name',
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
              cellTemplate: '<div>' +
              '{{grid.appScope.value__(grid, row)}}' +
              '</div>'

            },
            {
              name: 'action_status_name',
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
              name: 'lifecycle_insert_date',
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
          var ret = null;
          if (row.treeLevel == 0) {
            if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
              ret = entity.action_type_translation_key;
            }
            else if (row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.entity;
              ret = entity.action_type_translation_key;
            } else {
              ret = row.entity.action_type_translation_key;
            }
          } else {
            if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
              ret = entity.property_translation_key;
            }
            else if (row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.entity;
              ret = entity.property_translation_key;
            } else {
              ret = row.entity.property_translation_key;
            }
          }

          if (ret != null) {
            return $translate.instant(ret);
          } else {
            return '';
          }
        };

        $scope.value__ = function (grid, row, col) {
          var ret = null;
          var entity = null;

          if (row.treeLevel == 0) {
            if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
              entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
            }
            else if (row.treeNode.children[0]) {
              entity = row.treeNode.children[0].row.entity;
            } else {
              entity = row.entity;
            }

            if (entity != null) {
              // TODO: utiliser des constantes
              switch (entity.action_target_id) {
                case 1:
                  ret = download.name;
                  break;
                case 2:
                  ret = download.download_package.name;
                  break;
              }

              ret += ' (' + $translate.instant(entity.action_target_translation_key) + ')'
            }

          } else {
            if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
              entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
            }
            else if (row.treeNode.children[0]) {
              entity = row.treeNode.children[0].row.entity;
            } else {
              entity = row.entity;
            }

            if (entity != null) {
              if (entity.property_directory_id == null || entity.property_directory_id == undefined) {
                switch(entity.property_type_id) {
                  case 5: //TODO: utiliser constante
                    ret = $filter('timeFltr')(entity.property_value);
                        break;
                  default:
                    ret = entity.property_value;
                }

              } else {
                ret = entity.property_directory_path;
              }
            }

          }

          if (ret != null) {
            return ret;
          } else {
            return '';
          }
        };

        $scope.status__ = function (grid, row, col) {
          var ret = null;

          if (row.treeLevel == 0) {
            if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
              ret = entity.action_status_translation_key;
            }
            else if (row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.entity;
              ret = entity.action_status_translation_key;
            } else {
              ret = row.entity.action_status_translation_key;
            }
          } else {
            return '';
          }

          if (ret != null) {
            return $translate.instant(ret);
          } else {
            return '';
          }
        };

        $scope.date__ = function (grid, row, col) {
          if (row.treeLevel == 0) {
            if (row.groupHeader && row.treeNode.children[0].row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.treeNode.children[0].row.entity;
              return $filter('date')(entity.lifecycle_insert_date, 'dd/MM/yyyy HH:mm:ss', '-0200');
            }
            else if (row.treeNode.children[0]) {
              var entity = row.treeNode.children[0].row.entity;
              return $filter('date')(entity.lifecycle_insert_date, 'dd/MM/yyyy HH:mm:ss', '-0200');
            }

            return $filter('date')(row.entity.lifecycle_insert_date, 'dd/MM/yyyy HH:mm:ss', '-0200');
          } else {
            return '';
          }
        };

        if ($scope.download.download_package != null) {
          $scope.packageQueryPromise = DownloadResourceFctry.query({package_id: $scope.download.download_package.id},
            function (response) {
              $scope.gridOptions.data = response;

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
        $scope.downloadLogsPromise = DownloadResourceFctry.logs({Id: download.id, IdApplication: ApplicationConfigurationFcty.getData().id_application},
          function (response) {
            if (response != undefined && response != null) {
              angular.forEach(response, function(line) {
                $scope.download.logs += line.logs + '\r\n';
              });

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

        var websocketDownloadAction = null;
        var websocketPackageAction = null;
        $wamp.subscribe('plow.downloads.download.' + download.id + '.actions', onEventAction)
          .then(function (subscription) {
              websocketDownloadAction = subscription;
            }
          );

        $wamp.subscribe('plow.downloads.package.' + download.package_id + '.actions', onEventAction)
          .then(function (subscription) {
              websocketPackageAction = subscription;
            }
          );

        var flattenActionProperties = function (action) {
          var tab = [];
          angular.forEach(action.action_has_properties,
            function (property) {
              var a = {
                action_id: action.id,
                action_type_name: action.action_type.name,
                action_type_translation_key: action.action_type.translation_key,
                action_target_id: action.action_type.action_target.id,
                action_target_name: action.action_type.action_target.name,
                action_target_translation_key: action.action_type.action_target.translation_key,
                lifecycle_insert_date: action.lifecycle_insert_date,
                action_status_name: action.action_status.name,
                action_status_translation_key: action.action_status.translation_key,
                property_id: property.property_id,
                property_name: property.property.name,
                property_translation_key: property.property.translation_key,
                property_value: property.property_value,
                property_type_id: property.property.property_type_id,
                property_directory_id: (property.directory != null) ? property.directory.id : null,
                property_directory_path: (property.directory != null) ? property.directory.path : null
              };

              tab.push(a);
            }
          );
          return tab;
        };

        var prepareActionToExecution = function (action) {
          var object_id = null;
          //TODO: utiliser des constantes
          switch (action.action_type.action_target_id) {
            case 1:
              object_id = action.download_id;
              break;
            case 2:
              object_id = action.download_package_id;
              break;
          }

          return {
            object_id: object_id,
            action_id: action.id,
            action_target_id: action.action_type.action_target_id
          };
        };

        $scope.actionsQueryPromise = ActionResourceFctry.query({
            download_id$orµ1: download.id,
            download_package_id$orµ1: download.package_id
          },
          function (response) {
            var tab = [];
            angular.forEach(response,
              function (action) {
                tab = tab.concat(flattenActionProperties(action));

                actionsFormattedForExecutionList.push(prepareActionToExecution(action));
              }
            );

            $scope.gridActions.data = tab;
          }
        );

        //TODO: utiliser des constantes
        if (download.status != 1 && download.status != 2) {
          $scope.edition.directory = angular.copy($scope.download.directory);
          $scope.test = {};
          $scope.downloadFileExistsPromise = DownloadResourceFctry.exists({Id: download.id},
            function (response) {
              $scope.download.fileExists = response.return;
            }
          );
        }

        $scope.delete = function () {
          $scope.downloadLogsPromise = DownloadResourceFctry.deleteLogs({Id: download.id},
            function (response) {
              if (response.logs == "") {
                $translate('infosPlowdown.form.NO_INFO').then(function (translation) {
                  $scope.download.logs.logs = translation;
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

          if (websocketDownloadAction != null) {
            $wamp.unsubscribe(websocketDownloadAction);
          }

          if (websocketPackageAction != null) {
            $wamp.unsubscribe(websocketPackageAction);
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
          //TODO: utiliser des constantes
          var action = {
            download_package_id: download.package_id,
            action_status_id: 1,
            action_type_id: 2,
            action_has_properties: [
              {
                property_id: 3,
                directory_id: download.directory.id
              }
            ]
          };

          ActionResourceFctry.save(
            {
              action: JSON.stringify(action)
            }, function (response) {
              ActionResourceFctry.execute(
                {
                  object_id: download.package_id,
                  action_id: response.id,
                  action_target_id: response.action_type.action_target.id
                },
                function () {

                }
              );
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

        $scope.deleteAction = function (entity) {
          var actionId = null;

          // si on est sur un header
          if (entity[Object.keys(entity)[0]].hasOwnProperty('groupVal')) {
            actionId = entity[Object.keys(entity)[0]].groupVal;
          } else {
            actionId = entity.action_id;
          }

          ActionResourceFctry.delete({'Id': actionId}, function (response) {
            var idx = 0;
            var idxToDelete = [];
            angular.forEach($scope.gridActions.data,
              function (action) {
                if (actionId == action.action_id) {
                  idxToDelete.push(idx)
                }

                idx++;
              }
            );

            for (var i = idxToDelete.length - 1; i >= 0; i--) {
              $scope.gridActions.data.splice(idxToDelete[i], 1);
            }
          });
        };

        $scope.addAction = function () {
          $scope.modal = $modal.open({
            templateUrl: 'views/downloads/infosAction.html',
            controller: 'InfosActionCtrl',
            backdrop: 'static',
            size: 'md',
            resolve: {
              download: function () {
                return download;
              }
            }
          });
        };

        $scope.executeAllActions = function () {
          ActionResourceFctry.executeAll(actionsFormattedForExecutionList, function (response) {

          });
        };
      }
    ]
  );
