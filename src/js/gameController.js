app.controller('gameController', ['$scope', '$location', '$document', '$timeout', 'gameState', 'messageService', '$rootScope', '$interval',
    function ($scope, $location, $document, $timeout, gameState, messageService, $rootScope, $interval) {
        $scope.currentPlayerName = gameState.currentPlayerName;

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
        var card = document.getElementById('current-card');
        card.src = 'svg/cards/' + initialCard + '.svg';

        $scope.cardId = initialCard;

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

        if ($rootScope.playerStatus === 'admin') {

            gamePlayInterval = $interval(function () {
                messageService.playCard(gameState.pullCard());
            }, 1000);

        }

        $scope.$on('playcard', function(e, card) {
            var data = {};

            if(playedCards.length > 0) {
                data.lastCard = playedCards[playedCards.length - 1];
            } else {
                data.lastCard = 111;
            }

            data.card = card;
            playedCards.push(card);

            // Flip current card
            var currentCard = document.getElementById('current-card');
            currentCard.classList.add('animated', 'flipOutY');

            $timeout(function() {
                currentCard.classList.remove('animated', 'flipOutY');
                currentCard.src = 'svg/cards/' + card + '.svg';
                $scope.cardId = card;
                currentCard.classList.add('animated', 'flipInY');
            }, 500);

            var riddle = new Audio('audio/cards/riddle/' + card + '.es.mp3');
            riddle.play();
            riddle.addEventListener('ended', function () {
                $timeout(function() {
                    var name = new Audio('audio/cards/name/' + card + '.es.mp3');
                    name.play();
                    name.addEventListener('ended', function () {
                        // $timeout(function () {
                        //     playCards();
                        // }, 1000);
                    })
                }, 1000);
            });

            var cardName = $rootScope.cardData[card].name;
            //console.log('cardName:', cardName);
            $scope.cardName = cardName;
        });

        $scope.loteria = function () {
            if ($scope.cardsSelected >= 16 && !$scope.lostGame) {
                messageService.loteria(gameState.getOwnPlayer());
            }
        };

        $scope.$on('win', function (e, player) {
            $scope.goTo('winner');
        });

        $scope.$on('lose', function (e, player) {
            console.log("player", player, " failed an attempt");

            var ownPlayer = gameState.getOwnPlayer();

            if (player.id == ownPlayer.id) {
                $rootScope.lostGame = (--ownPlayer.hp) <= 0;
                $scope.hp = ownPlayer.hp;
            }
        });

        $scope.$on('tie', function (e, player) {
            $interval.cancel(gamePlayInterval);
            console.log("It's a tie!");
        });

        $scope.goTo = function (location) {
            $timeout(function() {
                $interval.cancel(gamePlayInterval);
                $location.path('/' + location);
            });
        };

        $scope.getCardSrc = function(card) {
            return 'svg/cards/' + card + '.svg';
        };

        $scope.range = function (n) {
            return Array(n);
        }
    }
]);