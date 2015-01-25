app.controller('createController', ['$scope', '$location', '$timeout', 'gameState', '$routeParams', '$rootScope',
    function($scope, $location, $timeout, gameState, $routeParams, $rootScope) {
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
        $scope.uuid = 12345;

        // current player ID
        $rootScope.uuid = generateUID();

/*
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
*/

        // Creatd Hydna channel/room
        var channel = new HydnaChannel('la-lote.hydna.net/' + $scope.uuid, 'rwe');

        // then register an event handler that alerts the data-part of messages
        // as they are received.
        channel.onmessage = function(event) {
            var message = JSON.parse(event.data);

            switch (message.action) {
                case 'join':
                // $rootscope.$broadcast("playerJoin");
                console.log("joined", message.data);
                gameState.joinGame(message.data.name);
                break;

                default:
                console.log("default", message);
                break;
            }

        };

        // the admin joins the game automatically
        channel.onopen = function(event) {
            if ($rootScope.playerStatus == 'admin') {
                channel.send(JSON.stringify({
                    action: "join",
                    data: {
                        id: $scope.playerId,
                        name: "admin"
                    }
                }));
            }
        };

        // New player submits his name
        $scope.addPlayer = function() {
            // Create player object
            var player = {};
            player.name = $scope.playerName;

/*
            // Trigger event
            myChannel.trigger('client-newplayer', player);
*/
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