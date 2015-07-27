'use strict';

/**
 * @ngdoc overview
 * @name plowshareFrontApp
 * @description
 * # plowshareFrontApp
 *
 * Main module of the application.
 */
angular
  .module('plowshareFrontApp', [
    'ui.bootstrap',
    'ngAnimate',
    'ngCookies',
    'ngStorage',
    'ngResource',
    'ui.router',
    'pascalprecht.translate',
    'angular-capitalize-filter',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.grouping',
    'ui.grid.resizeColumns',
    'ui.grid.edit'
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider
        .otherwise('/app/downloads2');
      $stateProvider
        .state('app', {
          abstract: true,
          url: '/app',
          templateUrl: 'views/app.html'
        })
        .state('app.downloads', {
          abstract: true,
          templateUrl: 'views/downloads/download_main.html',
          controller: 'AddLinksCtrl'
        })
        .state('app.downloads.downloads', {
          url: '/downloads',
          templateUrl: 'views/downloads/downloads.html',
          controller: 'DownloadCtrl'
        })
        .state('app.downloads.downloads2', {
          url: '/downloads2',
          templateUrl: 'views/downloads/downloads2.html',
          controller: 'DownloadCtrl2'
        })
        .state('app.downloads.links', {
          url: '/links',
          templateUrl: 'views/downloads/links.html',
          controller: 'LinkCtrl'
        })
        .state('app.downloads.test', {
          url: '/test',
          templateUrl: 'views/test.html',
          controller: 'TestCtrl'
        });
    }
  ])
  .config(['$translateProvider', function ($translateProvider) {

    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.json'
    });

    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('fr');

    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();

  }])
  .constant('settings', {
    'SERVER_ADDRESS': 'http://capic.hd.free.fr',
    'SERVER_NOTIFICATION': 'ws://capic.hd.free.fr:7070/notifications'
  })
  .constant('listSeparatorDownloads', [',', ';', '\n'])
  .constant('downloadPriorities', [
    {id: 0, value: 'download.priority.LOW'},
    {id: 1, value: 'download.priority.NORMAL'},
    {id: 2, value: 'download.priority.HIGH'},
    {id: 3, value: 'download.priority.MAX'},
  ]
)
  .value('downloadStatusListValue', {})
  .value('linkStatusListValue', {})
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', 'webSocketFcty',
    function ($scope, $translate, $localStorage, $window, webSocketFcty) {
      $scope.notifications = webSocketFcty.getNewNotifications();

      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Plow',
        version: '0.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info: '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger: '#f05050',
          light: '#e8eff0',
          dark: '#3a3f51',
          black: '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false
        }
      };

      // save settings to local storage
      if (angular.isDefined($localStorage.settings)) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function () {
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = {isopen: false};
      $scope.langs = {fr: 'Français', en: 'English', de_DE: 'German', it_IT: 'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || 'English';
      $scope.setLang = function (langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
    }
  ]
);
