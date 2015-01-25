app.controller('playersController', ['$scope', '$location', 'messageService', '$rootScope', 'gameState',
    function($scope, $location, messageService, $rootScope, gameState) {
        // Play background audio
        var backgroundAudio = new Audio('audio/bg.mp3');
        backgroundAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        // TODO: Decomment this line
        //backgroundAudio.play();

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

            $scope.$apply();
        });

        $scope.players = [];

        $rootScope.lostGame = false;

        $scope.startGame = function() {
            messageService.startGame();
        };

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);