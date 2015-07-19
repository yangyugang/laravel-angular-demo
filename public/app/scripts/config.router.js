'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
angular.module('app')
  .run(
    [           '$rootScope', '$state', '$stateParams',
      function ( $rootScope,   $state,   $stateParams ) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG',
      function ( $stateProvider,   $urlRouterProvider,  MODULE_CONFIG ) {
        $urlRouterProvider
          .otherwise('/app/dashboard');
        $stateProvider
          .state('app', {
            abstract: true,
            url: '/app',
            views: {
              '': {
                templateUrl: '/app/views/layout.html'
              },
              'aside': {
                templateUrl: '/app/views/aside.html'
              },
              'content': {
                templateUrl: '/app/views/content.html'
              }
            }
          })
            .state('app.dashboard', {
              url: '/dashboard',
              templateUrl: '/app/views/pages/dashboard.html',
              data : { title: 'Dashboard' },
              resolve: load(['/app/scripts/controllers/chart.js','/app/scripts/controllers/vectormap.js'])
            })
          .state('ui', {
            url: '/ui',
            abstract: true,
            views: {
              '': {
                templateUrl: '/app/views/layout.html'
              },
              'aside': {
                templateUrl: '/app/views/aside.html'
              },
              'content': {
                templateUrl: '/app/views/content.html'
              }
            }
          })

            // form routers
            .state('ui.form', {
              url: '/form',
              template: '<div ui-view></div>'
            })
              .state('ui.form.validation', {
                url: '/validation',
                templateUrl: '/app/views/ui/form/validation.html',
                data : { title: 'Validations' }
              })
            // table routers
            .state('ui.table', {
              url: '/table',
              template: '<div ui-view></div>'
            })
              .state('ui.table.datatable', {
                url: '/datatable',
                data : { title: 'Datatable' },
                templateUrl: '/app/views/ui/table/datatable.html'
              })
          ;


          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            if(!module.module){
                              name = module.files;
                            }else{
                              name = module.name;
                            }
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }
      }
    ]
  );
