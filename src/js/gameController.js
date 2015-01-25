app.controller('gameController', ['$scope', '$location', '$document', '$timeout', 'gameState', 'messageService', '$rootScope', '$interval',
    function ($scope, $location, $document, $timeout, gameState, messageService, $rootScope, $interval) {
        $scope.currentPlayerName = gameState.currentPlayerName;

        var backgroundAudio = new Audio('audio/bg.mp3');
        backgroundAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        backgroundAudio.play();

        var riddleSound = null,
            cardSound = null;

        // Return if the game isn't started yet
        if (!gameState.started) {
            $location.path('/');
            return;
        }

        var gamePlayInterval = null;

        // Selected cards
        $scope.cardsSelected = 0;

        // Set initial card
        var initialCard = gameState.getInitialCard();
        //console.log('initialCard:', initialCard);
        var cardImage = document.getElementById('current-card-image');
        cardImage.src = 'svg/cards/' + initialCard + '.svg';

        $scope.cardId = initialCard;
        $scope.tied = false;

        // current player HP
        $scope.hp = gameState.getOwnPlayer().hp;

        // Played cards
        var playedCards = [];

        // Get cards for player
        $scope.cards = gameState.getOwnPlayer().board;

        // Subscribe to new card event
        // if ($rootScope.playerStatus === 'player') {
        //     myChannel.bind('client-newcard',
        //         function (data) {
        //             console.log(data);
        //             var currentCard = document.getElementById('current-card');
        //             currentCard.classList.add('animated', 'flipOutY');
        //             $timeout(function () {
        //                 currentCard.classList.remove('animated', 'flipOutY');
        //                 currentCard.src = 'svg/cards/01.svg'; // TODO: Set src dynamically
        //                 currentCard.classList.add('animated', 'flipInY');
        //             }, 2000);
        //         }
        //     );
        // }

        var playCards = function () {
            var card = gameState.pullCard();
            // Flip current card
            var currentCard = document.getElementById('current-card'),
                currentCardImage = document.getElementById('current-card-image');

            if (!currentCard) {
                return;
            }

            currentCard.classList.add('animated', 'flipOutY');

            $timeout(function() {
                currentCard.classList.remove('animated', 'flipOutY');
                currentCardImage.src = 'svg/cards/' + card + '.svg';
                $scope.cardId = card;
                currentCard.classList.add('animated', 'flipInY');
            }, 500);

            messageService.playCard(card);

            riddleSound = new Audio('audio/cards/riddle/' + card + '.es.mp3');
            riddleSound.play();
            riddleSound.addEventListener('ended', function () {
                $timeout(function() {
                    cardSound = new Audio('audio/cards/name/' + card + '.es.mp3');
                    cardSound.play();
                    cardSound.addEventListener('ended', function () {
                        $timeout(function () {
                            playCards();
                        }, 1000);
                    })
                }, 1000);
            });

            var cardName = $rootScope.cardData[card].name;
            //console.log('cardName:', cardName);
            $scope.cardName = cardName;
        };

        if ($rootScope.playerStatus === 'admin') {
            var initSound = new Audio('audio/00.es.mp3');
            initSound.play();
            initSound.addEventListener('ended', function () {
                $timeout(function () {
                    playCards();
                }, 1000);
            });
        } else {
            var initSound = new Audio('audio/00.es.mp3');
            initSound.play();
            $scope.$on('playcard', function(e, card) {
                // Flip current card
                var currentCard = document.getElementById('current-card'),
                    currentCardImage = document.getElementById('current-card-image');

                if (!currentCard) {
                    return;
                }

                currentCard.classList.add('animated', 'flipOutY');

                $timeout(function() {
                    currentCard.classList.remove('animated', 'flipOutY');
                    currentCardImage.src = 'svg/cards/' + card + '.svg';
                    $scope.cardId = card;
                    currentCard.classList.add('animated', 'flipInY');
                }, 500);

                riddleSound = new Audio('audio/cards/riddle/' + card + '.es.mp3');
                riddleSound.play();
                riddleSound.addEventListener('ended', function () {
                    $timeout(function() {
                        cardSound = new Audio('audio/cards/name/' + card + '.es.mp3');
                        cardSound.play();
                    }, 1000);
                });

                var cardName = $rootScope.cardData[card].name;
                //console.log('cardName:', cardName);
                $scope.cardName = cardName;
            });
        }

        // Card click listener
        $scope.onCardClick = function ($event) {
            var e = $event;
            var card = e.target;
            var bean = card.$.bean;

            // TODO: Decomment these
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

            if (bean.classList.contains('active')) {
                $scope.cardsSelected++;
            } else {
                $scope.cardsSelected--;
            }
        };

        /*if ($rootScope.playerStatus === 'admin') {

            gamePlayInterval = $interval(function () {
                messageService.playCard(gameState.pullCard());
            }, 1000);

        }*/

        function stopSounds () {
            if (!riddleSound.paused) {
                riddleSound.pause();
            }
            if (!cardSound.paused) {
                cardSound.pause();
            }
            if (!backgroundAudio.paused) {
                backgroundAudio.pause();
            }
        }

        $scope.loteria = function () {
            if ($scope.cardsSelected >= 16 && !$scope.lostGame) {
                messageService.loteria(gameState.getOwnPlayer());
            }
        };

        $scope.$on('win', function (e, player) {
            $rootScope.winner = player.name;
            stopSounds();
            $scope.goTo('winner');
        });

        $scope.$on('lose', function (e, player) {
            console.log("player", player, " failed an attempt");

            var ownPlayer = gameState.getOwnPlayer();

            if (player.id == ownPlayer.id) {
                $rootScope.lostGame = (--ownPlayer.hp) <= 0;
                $scope.hp = ownPlayer.hp;

                showToaster('Not a winner, check your board!');

                $scope.$apply();
            }
        });

        $scope.$on('tie', function (e, player) {
            $interval.cancel(gamePlayInterval);
            $scope.tied = true;
            showToaster("It's a tie!");
        });

        $scope.$on('endgame', function (e, player) {
            console.log("Host has left the game");
            showToaster('The host player has left the game.');
            stopSounds();
            $scope.goTo('/');
        });

        $scope.goTo = function (location) {
            $timeout(function() {
                $interval.cancel(gamePlayInterval);

                if ($rootScope.playerStatus == 'admin') {
                    messageService.endGame();
                }

                $location.path('/' + location);
                messageService.disconnect();
            });
        };

        $scope.getCardSrc = function(card) {
            return 'svg/cards/' + card + '.svg';
        };

        $scope.range = function (n) {
            return Array(n);
        };
    }
]);