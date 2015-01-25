app.controller('createController', ['$scope', '$location', '$timeout', 'gameState', 'messageService', '$routeParams', '$rootScope',
    function($scope, $location, $timeout, gameState, messageService, $routeParams, $rootScope) {
        // Player status
        if($routeParams.action === 'start') {
            $rootScope.playerStatus = 'admin';
        } else {
            $rootScope.playerStatus = 'player';
        }

        // Players list
        $scope.players = [];

        // Player name
        $scope.playerName = null;

        $scope.canStartGame = false;

        // TODO: UID should be set only when playerstatus == admin
        $scope.uuid = gameState.createGame();

        messageService.connect($scope.uuid, $rootScope.playerStatus);

        // New player submits his name
        $scope.addPlayer = function() {
            // Create player object
            gameState.createOwnPlayer($scope.playerName);

            // Fade out text input
            var nameInput = document.getElementById('name-input-component');
            nameInput.classList.add('animated', 'fadeOut');

            // Update players list and remove text input
            $timeout(function () {
                nameInput.parentNode.removeChild(nameInput);
            }, 1000);

            $scope.canStartGame = true;
        };

        $rootScope.$on('join', function (e, player) {
            console.log("player ", player, " has joined");
            $scope.players.push(player);
        });

        // Go to (Start Game or Exit)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };

        $scope.startGame = function () {
            if ($scope.canStartGame) {
                $scope.goTo('game');
            }
        }
    }
]);