app.controller('createController', ['$scope', '$location', '$timeout', 'gameState', 'messageService', '$routeParams', '$rootScope',
    function($scope, $location, $timeout, gameState, messageService, $routeParams, $rootScope) {
        // Play background audio
        $scope.backgroundAudio = new Audio('audio/bg.mp3');
        $scope.backgroundAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        $scope.backgroundAudio.play();

        // Players list
        $scope.players = [];

        // Player name
        $scope.playerName = null;

        $scope.canStartGame = false;

        $rootScope.lostGame = false;

        // Player status
        if($routeParams.action === 'start') {
            $rootScope.playerStatus = 'admin';
            $scope.uuid = gameState.createGame();
            messageService.connect($scope.uuid, $rootScope.playerStatus);
        } else {
            $rootScope.playerStatus = 'player';
        }

        // New player submits his name
        $scope.addPlayer = function() {
            // Create player object
            messageService.join(gameState.createOwnPlayer($scope.playerName));

            // Fade out text input
            var nameInput = document.getElementById('name-input-component');
            nameInput.classList.add('animated', 'fadeOut');

            // Update players list and remove text input
            $timeout(function () {
                nameInput.parentNode.removeChild(nameInput);
            }, 1000);

            $scope.canStartGame = true;
        };

        $scope.setRoom = function () {
            // Fade out text input
            var nameInput = document.getElementById('room-input-component');
            nameInput.classList.add('animated', 'fadeOut');
            messageService.connect($scope.uuid, $rootScope.playerStatus);
        };

        $scope.$on('join', function (e, player) {
            console.log("player ", player, " has joined");
            // $scope.$apply();
        });

        $scope.$on('players', function (e, players) {
            console.log("players sync");

            $scope.players = _.union(_.map($scope.players, function (player) {
                // return {
                //     name: player.name,
                //     id: player.id
                // }
                return player;
            }), players);

            $scope.$apply();
        });

        $scope.$on('start', function () {
            gameState.started = true;
            $scope.goTo('game');
        });

        // Go to (Start Game or Exit)
        $scope.goTo = function(location) {
            $scope.backgroundAudio.pause();
            $scope.backgroundAudio.currentTime = 0;

            $location.path('/' + location);

            $timeout(function () {
                $scope.$apply();
            });
        };

        $scope.startGame = function () {
            if ($scope.canStartGame) {
                messageService.startGame();
            }
        }
    }
]);