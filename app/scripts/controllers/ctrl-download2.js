'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('DownloadCtrl2', ['$scope', '$filter', '$translate', 'DownloadResourceFctry', 'DirectoryResourceFctry', 'ActionResourceFctry', 'downloadStatusListValue', 'downloadPriorities', '$modal', 'uiGridGroupingConstants', '$wamp', 'dialogs','hostPicturesList', 'HostPictureResourceFctry',
      function ($scope, $filter, $translate, DownloadResourceFctry, DirectoryResourceFctry, ActionResourceFctry, downloadStatusListValue, downloadPriorities, $modal, uiGridGroupingConstants, $wamp, dialogs, hostPicturesList, HostPictureResourceFctry) {
        $scope.contextMenuEntity = {};

        function onevent(args) {
          var down = angular.fromJson(args[0]);

          angular.forEach($scope.gridOptions.data,
            function (download) {
              download.subscribed = false;
            }
          );

          var iterator = 0;
          var found = false;

          while (iterator < $scope.gridOptions.data.length && !found) {
            if (parseInt(down.id) === parseInt($scope.gridOptions.data[iterator].id)) {
              var now = new Date();
              found = true;
              $scope.gridOptions.data[iterator].download_package = down.download_package;
              $scope.gridOptions.data[iterator].progress_file = down.progress_file;
              $scope.gridOptions.data[iterator].time_left = down.time_left;
              $scope.gridOptions.data[iterator].status = down.status;
              $scope.gridOptions.data[iterator].size_file = down.size_file;
              $scope.gridOptions.data[iterator].average_speed = down.average_speed;
              $scope.gridOptions.data[iterator].directory = down.directory;
              $scope.gridOptions.data[iterator].theorical_start_datetime = new Date(down.theorical_start_datetime);

              $scope.gridOptions.data[iterator].counter = 0;
              if ($scope.gridOptions.data[iterator].theorical_start_datetime.getTime() > now) {
                $scope.gridOptions.data[iterator].counter = Math.round(( $scope.gridOptions.data[iterator].theorical_start_datetime.getTime() - now) / 1000);
              }

              if (down.status != 3) { // TODO: use constant
                $scope.gridOptions.data[iterator].subscribed = true;
              }
            }
            iterator++;
          }

          // => new download
          if (!found) {
            $scope.gridOptions.data.push(down);
          }
        }

        $scope.gridOptions = {
          treeRowHeaderAlwaysVisible: false,
          showGridFooter: true,
          enableRowSelection: true,
          enableGroupHeaderSelection: true,
          rowHeight: 35,
          rowTemplate: 'views/downloads/part/rowTemplate.html',
          columnDefs: [
            {
              name: 'download_package.name',
              displayName: 'Paquet',
              //grouping: {groupPriority: 0},
              cellTooltip: true,
              enableCellEdit: false
            },
            {
              name: 'name',
              displayName: 'Name',
              headerCellFilter: 'translate',
              enableCellEdit: false,
              cellTooltip: true,
              cellTemplate: '<div><span tooltip-placement="right" uib-tooltip="{{COL_FIELD}}">{{COL_FIELD}}</span></div>'
            },
            {
              name: 'host_id',
              displayName: 'Host',
              headerCellFilter: 'translate',
              enableCellEdit: false,
              width: 30,
              cellTemplate: '<div ng-if="row.entity.host_id != null"><img tooltip-placement="right" uib-tooltip="{{row.entity.download_host.name}}" class="img-20-centered" ng-src="data:image/png;base64,{{COL_FIELD | hostPictureFltr}}" /></div>'
            },
            /*{name: 'link', displayName: 'Link', enableCellEdit: false},*/
            {
              name: 'size_file',
              displayName: 'Size',
              cellFilter: 'bytesFltr',
              enableColumnResizing: false,
              enableCellEdit: false,
              width: 80
            },
            {
              name: 'status',
              displayName: 'Status',
              // grouping: {groupPriority: 0},
              //sort: {priority: 1, direction: 'asc'},
              cellFilter: 'downloadStatusFltr2',
              enableColumnResizing: false,
              enableCellEdit: false,
              width: 80
              //cellTemplate: '<div ng-if="row.groupHeader">{{COL_FIELD | downloadStatusFltr2}}</div>'
            },
            {
              name: 'progress_file',
              displayName: '%',
              width: '40',
              enableColumnResizing: false,
              enableCellEdit: false
            },
            {
              name: 'average_speed',
              displayName: 'Avg Speed',
              cellFilter: 'bytesPerSecondFltr',
              enableColumnResizing: false,
              enableCellEdit: false,
              width: 80
            },
            {
              name: 'time_left',
              displayName: 'Time Left',
              enableColumnResizing: false,
              enableCellEdit: false,
              width: 80,
              cellTemplate: '<div data-ng-if="row.entity.counter > 0 && row.entity.status == 2">' +
              '<timer interval="1000" countdown="row.entity.counter">- {{countdown | timeFltr}}</timer>' +
              '</div>' +
              '<div data-ng-if="row.entity.counter <= 0 || row.entity.status != 2">{{COL_FIELD | timeFltr}}</div>'
            },
            {
              name: 'priority',
              displayName: 'Pty',
              enableColumnResizing: false,
              cellTemplate: '<div>{{COL_FIELD | downloadPriorityFltr |translate}}</div>',
              editableCellTemplate: 'ui-grid/dropdownEditor',
              editDropdownValueLabel: 'value',
              editDropdownOptionsArray: downloadPriorities,
              editDropdownFilter: 'translate',
              width: 70
            }
          ],

          onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (rowChanged) {
              if (typeof(rowChanged.treeLevel) !== 'undefined' && rowChanged.treeLevel > -1) {
                // this is a group header
                var children = $scope.gridApi.treeBase.getRowChildren(rowChanged);
                children.forEach(function (child) {
                  if (rowChanged.isSelected) {
                    $scope.gridApi.selection.selectRow(child.entity);
                  } else {
                    $scope.gridApi.selection.unSelectRow(child.entity);
                  }
                });
              }
            });
            $scope.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
              if (newValue !== oldValue) {
                DownloadResourceFctry.updatePriority({id: rowEntity.id, priority: newValue},
                  function () {
                  },
                  function () {
                    rowEntity.priority = oldValue;
                  });
              }
            });

          }
        };

        // on recupere la liste des status
        downloadStatusListValue.status = DownloadResourceFctry.status(
          function () {
            HostPictureResourceFctry.query(function(response) {
              hostPicturesList.hosts = response;

              // on recupere la liste des downloads
              DownloadResourceFctry.query(
                function (responses) {
                  angular.forEach(responses,
                    function (response) {
                      var now = new Date().getTime();
                      // on transforme la chaine de caractere en date
                      response.theorical_start_datetime = new Date(response.theorical_start_datetime);

                      response.counter = 0;
                      // si le download est en cours et que la date theorique de début et après maintenant
                      // on calcul le nombre de secondes a attendre
                      if (response.status == 2 && response.theorical_start_datetime.getTime() > now) {
                        response.counter = Math.round((response.theorical_start_datetime.getTime() - now) / 1000);
                      }

                      $scope.gridOptions.data.push(response);
                    }
                  );

                  $wamp.subscribe('plow.downloads.downloads', onevent);
                }
              );
            });

          }
        );

        $scope.downloadRefreshInProgress = [];
        $scope.allDownloadRefresh = false;

        // to refresh only one download
        $scope.refreshDownload = function (entity) {
          $scope.allDownloadRefresh = true;
          $scope.downloadRefreshInProgress[entity.id] = 'glyphicon-refresh-animate';

          DownloadResourceFctry.refreshDownload({'Id': entity.id}, function (response) {
            var idx = $scope.gridOptions.data.indexOf(entity);
            $scope.gridOptions.data[idx] = response;

            $scope.downloadRefreshInProgress[entity.id] = '';
            $scope.allDownloadRefresh = false;
          });
        };

        // to refresh all downloads list
        $scope.refresh = function () {
          $scope.allDownloadRefresh = true;
          $scope.downloadsList = DownloadResourceFctry.refresh(function () {
            $scope.allDownloadRefresh = false;
          });
        };

        $scope.resetDownload = function (entity) {
          var downloadObject = new DownloadResourceFctry();
          downloadObject.id = entity.id;

          var dlg = dialogs.confirm($translate.instant('downloads.dialog.reset.TITLE'), $translate.instant('downloads.dialog.reset.TEXT'));
          dlg.result.then(
            function (btn) {
              downloadObject.deleteFile = true;
              downloadObject.wampId = $wamp.connection.session.id;
              downloadObject.$reset(function (response) {
                var idx = $scope.gridOptions.data.indexOf(entity);
                $scope.gridOptions.data[idx] = response;
              });
            }, function (btn) {
              downloadObject.deleteFile = false;
              downloadObject.$reset(function (response) {
                var idx = $scope.gridOptions.data.indexOf(entity);
                $scope.gridOptions.data[idx] = response;
              });
            }
          );
        };

        // to delete a download
        $scope.deleteDownload = function (entity) {
          DownloadResourceFctry.delete({Id: entity.id, wampId: $wamp.connection.session.id}, function (response) {
            if (response.return === true) {
              var idx = $scope.gridOptions.data.indexOf(entity);
              $scope.gridOptions.data.splice(idx, 1);
            }
          });
        };

        var remove = function (listIds) {
          DownloadResourceFctry.remove({ListId: listIds}, function (response) {
            if (response.listDownloadIdDeleted.length > 0) {
              angular.forEach(response.listDownloadIdDeleted, function (downloadId) {
                var found = false;
                var i = 0;

                while (i < $scope.gridOptions.data.length && !found) {
                  if ($scope.gridOptions.data[i].id == downloadId) {
                    $scope.gridOptions.data.splice(i, 1);
                    found = true;
                  }

                  i++;
                }
              });
            }
          });
        };

        // to delete the selected downloads
        $scope.deleteSelectedDownloads = function () {
          var selectedIds = [];
          angular.forEach($scope.gridApi.selection.getSelectedRows(), function (entity) {
            selectedIds.push(entity.id);
          });

          remove(selectedIds);
        };

        // to delete the finished downloads
        $scope.deleteDownloads = function (status) {
          var finishedIds = [];
          // TODO: use constant
          var finishedDownloads = $filter('filter')($scope.gridOptions.data, {status: status});
          finishedDownloads = finishedDownloads.concat($filter('filter')($scope.gridOptions.data, {status: 10}));
          angular.forEach(finishedDownloads, function (entity) {
            finishedIds.push(entity.id);
          });

          remove(finishedIds);
        };

        $scope.infosPlowdown = function (download) {
          $scope.modal = $modal.open({
            templateUrl: 'views/downloads/infos/infosPlowdownPopup.html',
            controller: 'InfosPlowdownCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              download: function () {
                return download;
              }
            }
          });

          $scope.modal.result.then(
            function (newDirectory) {
              if (newDirectory.path != '' && download.directory.path != newDirectory.path) {

                var moveFct = function (downloadToMove) {
                  var directoryResourceObject = new DirectoryResourceFctry();

                  var directory = {};
                  directory.path = newDirectory.path;
                  directoryResourceObject.directory = JSON.stringify(directory); // on doit forcer en string pour correspondre avec le serveur rest

                  directoryResourceObject.$save(
                    function (response) {
                      //TODO: utiliser des constantes
                      var action = {
                        download_id: downloadToMove.id,
                        action_status_id: 1,
                        action_type_id: 1,
                        action_has_properties: [
                          {
                            property_id: 2,
                            directory_id: downloadToMove.directory.id
                          },
                          {
                            property_id: 3,
                            directory_id: response.id
                          }
                        ]
                      };

                      ActionResourceFctry.save(
                        {action: JSON.stringify(action)},
                        function (response) {
                          // si le statut est terminé on déplace le fichier
                          // TODO: utiliser des constantes
                          if (downloadToMove.status == 3 || downloadToMove.status == 10) {
                            ActionResourceFctry.execute({
                                object_id: downloadToMove.id,
                                action_id: response.id,
                                action_target_id: response.action_type.action_target_id
                              },
                              function () {
                                /*
                                 var found = false;
                                 var i = 0;
                                 while (!found && i < $scope.gridOptions.data.length) {
                                 if ($scope.gridOptions.data[i].id == downloadReturned.id) {
                                 $scope.gridOptions.data[i] = downloadReturned;
                                 found = true;
                                  }
                                 i++;
                                }
                                 */
                              },
                              function () {
                                /*
                                 downloadToMove.status = oldStatus;
                                 var found = false;
                                 var i = 0;
                                 while (!found && i < $scope.gridOptions.data.length) {
                                 if ($scope.gridOptions.data[i].id == downloadToMove.id) {
                                 $scope.gridOptions.data[i] = downloadToMove;
                                 found = true;
                                 }
                                 i++;
                                 }
                                 */
                              }
                            );
                          }
                        }
                      );
                    },
                    function (response) {

                    }
                  );
                };

                var oldStatus = download.status;

                if (newDirectory.path.slice(-1) != '/') {
                  newDirectory.path += '/';
                }

                if (download.download_package != null) {
                  var dlg = dialogs.confirm($translate.instant("downloads.dialog.move.TITLE"), $translate.instant("downloads.dialog.move.TEXT"));
                  dlg.result.then(
                    function (btn) {
                      //parcourir tous les download du package
                      var listDownloadForPackage = $filter('filter')($scope.gridOptions.data, {package_id: download.package_id});
                      angular.forEach(listDownloadForPackage, function (downloadForPackage) {
                        moveFct(downloadForPackage);
                      });
                    }, function (btn) {
                      moveFct(download);
                    }
                  );
                } else {
                  moveFct(download);
                }
              }
            }
          );
        };
      }
    ]
  );
