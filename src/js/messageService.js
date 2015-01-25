app.factory('messageService', function ($rootScope, $http, $interval, gameState) {
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

            channel.onmessage = function(event) {
                var message = JSON.parse(event.data);

                switch (message.action) {
                    case 'join':
                    console.log('joined', message);

                    // only admin keeps track of player cards
                    if (playerRole == 'admin') {
                        gameState.joinGame(message.data.id, message.data.name);
                    }
                    break;

                    case 'loteria':
                    console.log('loteria ', message.data.name);
                    
                    // if player won, send a win message
                    if (playerRole == 'admin' && gameState.hasWon(message.data.id)) {
                        sendMessage('win', message.data);
                    } 
                    else {
                        sendMessage('lose', message.data);
                    }
                    break;

                    case 'win':
                    console.log("win", message.data);
                    $rootScope.$broadcast("win", message.data);
                    break;

                    case 'lose':
                    console.log("lose", message.data);
                    $rootScope.$broadcast("lose", message.data);
                    break;

                    case 'playCard':
                    console.log("playcard ", message.data);
                    $rootScope.$broadcast("playcard", message.data);
                    break;

                    default:
                    console.log('default', message);
                    break;
                }
            };
        },

        join: function (player) {
            sendMessage('join', player);
        },

        loteria: function (player) {
            sendMessage('loteria', player);
        },

        playCard: function (card) {
            sendMessage('playCard', card);
        }
    };

    return service;
});