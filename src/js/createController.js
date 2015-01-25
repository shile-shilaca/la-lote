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
        // New player submits his name
        $scope.addPlayer = function () {
            // Create player object
            var player = {};
            player.name = $scope.playerName;
            player.id = generateUID();
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