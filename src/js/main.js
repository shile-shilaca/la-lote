var app = angular.module('lottery', ['ngRoute']);

/** Routes Configuration **/
app.config(function ($routeProvider) {
    /** Home **/
    $routeProvider.when('/', {
        templateUrl : './templates/home.tpl.html',
        controller  : 'homeController'
    })
    /** Join **/
    .when('/create', {
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

/** Define Controllers **/

// Home Controller
app.controller('homeController', ['$scope', '$location', '$anchorScroll',
    function ($scope, $location, $anchorScroll) {
        // Scroll to section
        $scope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };
        // Go to (New Game or Join an Existing Game)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        }
    }
]);

// Create Game Controller
app.controller('createController', ['$scope', '$location',
    function ($scope, $location) {
        // Go to (Start Game or Exit)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        }
    }
]);

// Game Controller
app.controller('gameController', ['$scope', '$location',
    function ($scope, $location) {
        // Go to (Exit or Loteria)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        }
    }
]);

// Winner Controller
app.controller('winnerController', ['$scope',
    function ($scope) {

    }
]);