app.factory('messageService', ['$rootScope', '$interval', 'gameState', function ($rootScope, $interval, gameState) {
    var channel = null,
        role = null,
        sendMessage = function (action, data) {
            channel.send(JSON.stringify({
                action: action,
                data: data
            }));
        }

    var service = {
        connect: function (roomId, playerRole) {
            // Create Hydna channel/room
            role = role;
            channel = new HydnaChannel('la-lote.hydna.net/' + roomId, 'rwe');

            channel.onopen = function () {
                $rootScope.$broadcast("open");
            };

            channel.onmessage = function(event) {
                var message = JSON.parse(event.data);

                switch (message.action) {
                    case 'join':
                    console.log('joined', message);
                    gameState.joinGame(message.data.id, message.data.name);

                    $rootScope.$broadcast('join', message.data);

                    sendMessage('players', _.map(gameState.getPlayers(), function (player) {
                            return player.name;
                        })
                    );
                    break;

                    case 'loteria':
                    console.log('loteria ', message.data.name);

                    // if player won, send a win message
                    if (playerRole == 'admin') {
                        if (gameState.hasWon(message.data.id)) {
                            sendMessage('win', message.data);
                        }
                        else {
                            sendMessage('lose', message.data);
                        }
                    }

                    break;

                    case 'win':
                    console.log('win', message.data);
                    $rootScope.$broadcast('win', message.data);
                    break;

                    case 'lose':
                    console.log('lose', message.data);
                    $rootScope.$broadcast('lose', message.data);
                    break;

                    case 'endgame':
                    console.log('endgame');
                    $rootScope.$broadcast('endgame');
                    service.disconnect();
                    break;

                    case 'players':
                    console.log('players sync', message.data);
                    $rootScope.$broadcast('players', message.data);
                    break;

                    case 'start':
                    console.log('start');
                    $rootScope.$broadcast('start');
                    break;

                    case 'playCard':
                    // console.log('playcard ', message.data);

                    if (!!message.data) {
                        $rootScope.$broadcast('playcard', message.data);
                    }
                    else {
                        $rootScope.$broadcast('tie', message.data);
                    }

                    break;

                    default:
                    console.log('default', message);
                    break;
                }
            };
        },

        disconnect: function () {
            if (!!channel) {
                channel.close();
                channel = role = null;
            }
        },

        endGame: function () {
            sendMessage('endgame');
        },

        join: function (player) {
            sendMessage('join', player);
        },

        loteria: function (player) {
            sendMessage('loteria', player);
        },

        playCard: function (card) {
            sendMessage('playCard', card);
        },

        startGame: function () {
            sendMessage('start');
        }
    };

    return service;
}]);