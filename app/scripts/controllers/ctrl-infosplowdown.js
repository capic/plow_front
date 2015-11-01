'use strict';

/**
 * @ngdoc function
 * @name plowshareFrontApp.controller:CtrlInfosplowdownctrlCtrl
 * @description
 * # CtrlInfosplowdownctrlCtrl
 * Controller of the plowshareFrontApp
 */
angular.module('plowshareFrontApp')
  .controller('InfosPlowdownCtrl', ['$scope', '$modalInstance', '$translate', '$filter', 'DownloadResourceFctry', 'downloadPriorities', 'download', '$wamp', 'dialogs',
    function ($scope, $modalInstance, $translate, $filter, DownloadResourceFctry, downloadPriorities, download, $wamp, dialogs) {
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
      $scope.pathEdition = false;
      $scope.edition = {};
      $scope.edition.downloadDirectory = angular.copy($scope.download.directory);
      $scope.nbrDownloadsToFinishBeforeUnrar = 0;
      $scope.download.theorical_start_datetime = new Date($scope.download.theorical_start_datetime);
      $scope.download.fileExists = true; // par defaut on suppose que le fichier existe

      if (($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) > 0) {
        $scope.startCounter = Math.round(($scope.download.theorical_start_datetime.getTime() - new Date().getTime()) / 1000);
      }

      $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        rowHeight: 35,
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
            name: 'directory',
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

            // TODO: use constant
            $scope.nbrDownloadsToFinishBeforeUnrar = $filter('filter')(response, { status: 1 }).length;
            $scope.nbrDownloadsToFinishBeforeUnrar += $filter('filter')(response, { status: 2 }).length;
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

      DownloadResourceFctry.exists({Id: download.id},
        function (response) {
          console.log(response.return);
          $scope.download.fileExists = response.return;
        }
      );

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
        $modalInstance.close($scope.download);
      };

      $scope.cancel = function () {
        $modalInstance.close($scope.download);
      };

      $scope.$watch("downloadPriority.selected",
        function (newVal, oldVal) {
          if (newVal != oldVal) {
            DownloadResourceFctry.updatePriority({id: newVal});
          }
        }
      );

      $scope.modifyPath = function () {
        if ($scope.edition.downloadDirectory != '' && $scope.edition.downloadDirectory != $scope.download.directory) {

          var moveFct = function(withPackage) {
            DownloadResourceFctry.move({id: download.id, directory: $scope.edition.downloadDirectory, withPackage: withPackage},
              function (down) {
                $scope.download = down;
              },
              function () {
                download.status = oldStatus;
              }
            );
          };

          var oldStatus = download.status;

          //TODO: utiliser une constante
          if (download.status != 2 && download.status != 1) {
            download.status = 9;
          }

          if ($scope.edition.downloadDirectory.slice(-1) != '/') {
            $scope.edition.downloadDirectory += '/';
          }

          if ($scope.download.download_package != null) {
            var dlg = dialogs.confirm($translate('infosPlowdown.form.NO_INFO'), $translate('infosPlowdown.form.NO_INFO'));
            dlg.result.then(
              function(btn){
                moveFct(true);
              },function(btn){
                moveFct(false);
              }
            );
          } else {
            moveFct(false);
          }
        }

        $scope.pathEdition = false;
      };

      $scope.unrar = function() {
        DownloadResourceFctry.unrar({id: download.id},
          function() {

          }
        );
      };
    }
  ]
);
