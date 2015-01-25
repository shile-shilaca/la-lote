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