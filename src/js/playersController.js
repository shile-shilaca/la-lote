app.controller('playersController', ['$scope', '$location', 'messageService', '$rootScope', '$timeout', 'gameState',
    function($scope, $location, messageService, $rootScope, $timeout, gameState) {
        if (!$rootScope.playerStatus) {
            $location.path('/');
            return;
        }

        // Play background audio
        /*var backgroundAudio = new Audio('audio/bg.mp3');
        backgroundAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        backgroundAudio.play();*/

        $scope.hasPlayers = false;

        if($rootScope.playerStatus === 'admin') {
            $scope.gameCode = gameState.createGame();
            messageService.connect($scope.gameCode, $rootScope.playerStatus);
        } else {
            $scope.gameCode = gameState.currentGameUID;
            messageService.connect(gameState.currentGameUID, $rootScope.playerStatus);
        }

        $scope.$on('open', function () {
            messageService.join(gameState.createOwnPlayer(gameState.currentPlayerName));
        });

        $scope.$on('players', function (e, players) {
            console.log("players sync");

            $scope.players = _.union(_.map($scope.players, function (player) {
                return player;
            }), players);

            $scope.hasPlayers = true;

            $scope.$apply();
        });

        $scope.$on('start', function () {
             gameState.startGame();

             $timeout(function () {
                 $scope.goTo('game');
             });
         });

        $scope.$on('gamealreadystarted', function () {
            // TODO: Create view for this

             console.log('Game has already started');

             $timeout(function () {
                 $scope.goTo('/');
             });
         });

        $scope.players = [];

        $rootScope.lostGame = false;

        $scope.startGame = function() {
            if ($scope.hasPlayers) {
                messageService.startGame();
            }
        };

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);