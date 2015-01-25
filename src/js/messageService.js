app.factory('messageService', function ($rootScope, $http, $interval, gameState) {
    var channel = null;

    var service = {
        connect: function (roomId) {
            // Create Hydna channel/room
            channel = new HydnaChannel('la-lote.hydna.net/' + roomId, 'rwe');

            channel.onmessage = function(event) {
                var message = JSON.parse(event.data);

                switch (message.action) {
                    case 'join':
                    console.log("joined", message);
                    gameState.joinGame(message.data.id, message.data.name);
                    break;

                    default:
                    console.log("default", message);
                    break;
                }
            };
        },

        join: function (player) {
            channel.send(JSON.stringify({
                action: "join",
                data: player
            }));
        },
    };

    return service;
});