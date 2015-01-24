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
        };
    }
]);

// Create Game Controller
app.controller('createController', ['$scope', '$location',
    function ($scope, $location) {
        // Go to (Start Game or Exit)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };
    }
]);

// Game Controller
app.controller('gameController', ['$scope', '$location', '$document',
    function ($scope, $location, $document) {
        // Go to (Exit or Loteria)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };

        // Card click listener
        var onCardClick = function (e) {
            var card = e.target;
            var bean = card.$.bean;
            // Firefox
            /*bean.style.top = (e.layerY) + 'px';
            bean.style.left = (e.layerX) + 'px';*/
            // Chrome
            bean.style.top = e.target.offsetTop + 'px';
            bean.style.left = e.target.offsetLeft + 'px';

            var a = Math.random() * 360;
            bean.style.transform = 'rotate(' + a + 'deg)';

            card.classList.toggle("active");
            bean.classList.toggle("active");
        };
        // Get cards
        var cards = document.getElementsByTagName('lottery-card');
        // Assign event listener
        for (var i = 0, l = cards.length; i < l; i++) {
            var card = cards[i];
            card.addEventListener('click', onCardClick, false);
        }
    }
]);

// Winner Controller
app.controller('winnerController', ['$scope',
    function ($scope) {

    }
]);