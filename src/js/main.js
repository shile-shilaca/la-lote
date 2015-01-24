var app = angular.module('lottery', ['ngRoute']);

/** Routes Configuration **/
app.config(function ($routeProvider) {
    /** Home **/
    $routeProvider.when('/', {
        templateUrl : './templates/home.tpl.html',
        controller  : 'homeController'
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
        $scope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        }
    }
]);