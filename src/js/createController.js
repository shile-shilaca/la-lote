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

        // UID
        $scope.uuid = gameState.createGame();

        messageService.connect($scope.uuid);

        // New player submits his name
        $scope.addPlayer = function() {
            // Create player object
            var player = {};
            player.name = $scope.playerName;
            player.id = $rootScope.uuid;

            messageService.join(player);

            // Fade out text input
            var nameInput = document.getElementById('name-input-component');
            nameInput.classList.add('animated', 'fadeOut');
            // Update players list and remove text input
            $timeout(function () {
                nameInput.parentNode.removeChild(nameInput);
                $scope.players.push(player);
            }, 1000);
        };

        // Go to (Start Game or Exit)
        $scope.goTo = function (location) {
            $location.path('/' + location);
        };
    }
]);