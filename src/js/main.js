var app = angular.module('lottery', ['ngRoute', 'pusher-angular']);

/** Routes Configuration **/
app.config(function ($routeProvider) {
    /** Home **/
    $routeProvider.when('/', {
        templateUrl : './templates/home.tpl.html',
        controller  : 'homeController'
    })
    /** Join **/
    .when('/create/:action', {
        templateUrl : './templates/create.tpl.html',
        controller  : 'createController'
    })
    .when('/game', {
        templateUrl : './templates/game.tpl.html',
        controller  : 'gameController'
    })
    .when('/winner', {
        templateUrl : './templates/winner.tpl.html',
        controller  : 'winnerController'
    })
    /** Error View **/
    .when('/error', {
        templateUrl : './templates/error.tpl.html'
    }).otherwise({
        redirectTo  : '/'
    });
});

app.run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function () {
        $location.path('/error');
    });
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.isLoading = false;
    });
});