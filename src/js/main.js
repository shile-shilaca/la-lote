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
        $scope.goTo = function (location, action) {
            if (action) {
                $location.path('/' + location + '/' + action);
            } else {
                $location.path('/' + location);
            }
        };
    }
]);

// Create Game Controller
app.controller('createController', ['$scope', '$location', '$pusher', '$timeout', 'gameState', '$routeParams', '$rootScope',
    function ($scope, $location, $pusher, $timeout, gameState, $routeParams, $rootScope) {
        // Player status
        if ($routeParams.action === 'start') {
            $rootScope.playerStatus = 'admin';
        } else {
            $rootScope.playerStatus = 'player';
        }
        // Players list
        $scope.players = [];
        // Player name
        $scope.playerName = null;
        // UUID
        $scope.uuid = gameState.createGame();
        $scope.uuid = 12345;
        // Create Pusher room
        var pusher = new Pusher('f5656bd4670f11759284', {
            authEndpoint: 'http://127.0.0.1:5000/pusher/auth'
        });
        // Create channel
        var myChannel = pusher.subscribe('private-' + $scope.uuid + '');
        // Subscribe to new player event
        myChannel.bind('client-newplayer',
            function(data) {
                $scope.$apply(function () {
                    $scope.players.push(data);
                });
            }
        );
        // Generate UUID
        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxx' . replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
        // New player submits his name
        $scope.addPlayer = function () {
            // Create player object
            var player = {};
            player.name = $scope.playerName;
            player.id = generateUUID();
            $rootScope.uuid = player.id;
            // Trigger event
            myChannel.trigger('client-newplayer', player);
            // Fade out text input
            var nameInput = document.getElementById('name-input-component');
            nameInput.classList.add('animated', 'fadeOut');
            // Update players list and remove text input
            $timeout(function () {
                nameInput.parentNode.removeChild(nameInput);
                $scope.players.push(player);
            }, 1000);
            gameState.joinGame(player.id, player.name);
        };
        // Go to (Start Game or Exit)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };
    }
]);

// Game Controller
app.controller('gameController', ['$scope', '$location', '$document', '$timeout', 'gameState', '$rootScope', '$interval',
    function ($scope, $location, $document, $timeout, gameState, $rootScope, $interval) {
        // Play background audio
        var backgroundAudio = new Audio('audio/bg.mp3');
        backgroundAudio.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        backgroundAudio.play();
        // Selected cards
        $scope.cardsSelected = 0;
        // Set initial card
        var initialCard = gameState.getInitialCard();
        var card = document.getElementById('current-card');
        card.classList.remove('card00');
        card.classList.add('card' + initialCard);
        // Played cards
        var playedCards = [];
        // Get cards for player
        $scope.cards = $rootScope.players[$rootScope.uuid].board;
        // UUID
        $scope.uuid = gameState.createGame();
        $scope.uuid = 12345;
        // Create Pusher room
        var pusher = new Pusher('f5656bd4670f11759284', {
            authEndpoint: 'http://127.0.0.1:5000/pusher/auth'
        });
        // Create channel
        var myChannel = pusher.subscribe('private-' + $scope.uuid + '');
        // Subscribe to new card event
        if ($rootScope.playerStatus === 'player') {
            myChannel.bind('client-newcard',
                function (data) {
                    console.log(data);
                    var currentCard = document.getElementById('current-card');
                    currentCard.classList.add('animated', 'flipOutY');
                    $timeout(function () {
                        currentCard.classList.remove('animated', 'flipOutY');
                        currentCard.classList.remove('card' + data.lastCard);
                        currentCard.classList.add('card' + data.card);
                        currentCard.classList.add('animated', 'flipInY');
                    }, 2000);
                }
            );
        }

        if ($rootScope.playerStatus === 'admin') {
            playCards();
        }

        function playCards () {
            var card = gameState.pullCard();
            var data = {};
            if (playedCards.length > 0) {
                data.lastCard = playedCards[playedCards.length - 1];
            } else {
                data.lastCard = 111;
            }
            data.card = card;
            playedCards.push(card);
            //myChannel.trigger('client-newcard', data);
            // Flip Current Card
            var currentCard = document.getElementById('current-card');
            currentCard.classList.add('animated', 'flipOutY');
            $timeout(function () {
                currentCard.classList.remove('animated', 'flipOutY');
                currentCard.classList.remove('card' + data.lastCard);
                currentCard.classList.add('card' + data.card);
                currentCard.classList.add('animated', 'flipInY');
            }, 500);
            var riddle = new Audio('audio/cards/riddle/' + card + '.es.mp3');
            riddle.play();
            riddle.addEventListener('ended', function () {
                $timeout(function () {
                    var name = new Audio('audio/cards/name/' + card + '.es.mp3');
                    name.play();
                    name.addEventListener('ended', function () {
                        $timeout(function () {
                            playCards();
                        }, 1000);
                    })
                }, 1000);
            });
        }
        // Go to (Exit or Loteria)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };
    }
]);

// Winner Controller
app.controller('winnerController', ['$scope',
    function ($scope) {

    }
]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});