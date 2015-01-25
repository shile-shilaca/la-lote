var app = angular.module('lottery', ['ngRoute']);

/** Routes Configuration **/
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : './templates/home.tpl.html',
        controller  : 'homeController'
    })
    .when('/create', {
        templateUrl : './templates/create.tpl.html',
        controller  : 'createController'
    })
        .when('/join', {
            templateUrl : './templates/join.tpl.html',
            controller  : 'joinController'
        })
        .when('/players', {
            templateUrl : './templates/players.tpl.html',
            controller  : 'playersController'
        })
    .when('/game', {
        templateUrl : './templates/game.tpl.html',
        controller  : 'gameController'
    })
    .when('/winner', {
        templateUrl : './templates/winner.tpl.html',
        controller  : 'winnerController'
    })
    .when('/error', {
        templateUrl : './templates/error.tpl.html'
    }).otherwise({
        redirectTo  : '/'
    });
});

app.run(function($rootScope, $location, $http) {
    $rootScope.$on('$routeChangeError', function() {
        $location.path('/error');
    });
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.isLoading = false;
    });

    var lang = 'es'; // TODO: Set this dynamically
    $http.get('data/data.' + lang + '.json').success(function(result) {
        $rootScope.cardData = result.cards;
        $rootScope.content = result.content;
    });
});

app.filter('rawHtml', ['$sce', function($sce){
    return function(htmlString) {
        return $sce.trustAsHtml(htmlString);
    };
}]);