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
app.controller('gameController', ['$scope', '$location', '$document', '$timeout',
    function ($scope, $location, $document, $timeout) {
        var backgroundAudio = new Audio('audio/bg.mp3');
        backgroundAudio.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        //backgroundAudio.play();

        // Go to (Exit or Loteria)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };

        var riddle = new Audio('audio/cards/riddle/19.es.mp3');
        //riddle.play();
        riddle.addEventListener('ended', function () {
            $timeout(function () {
                var name = new Audio('audio/cards/name/19.es.mp3');
                name.play();
            }, 500);
        });

        $scope.nextCard = function () {
            var currentCard = document.getElementById('current-card');
            currentCard.classList.add('animated', 'flipOutY');
            $timeout(function () {
                currentCard.classList.remove('animated', 'flipOutY');
                currentCard.classList.remove('card01');
                currentCard.classList.add('card02');
                currentCard.classList.add('animated', 'flipInY');
            }, 2000);
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