app.factory('gameState', function ($rootScope, $http, $interval) {
    $rootScope.players = {};

    var cards = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53'],
        currentGame = [],
        players = $rootScope.players,
        currentRoom = null;

    function generateRoomId() {
        var d = new Date().getTime();
        var uuid = 'xxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    var service = {
        started: false,

        // Initializes a room and returns the new room ID
        createGame: function () {
            players = {};
            currentGame = _.shuffle(cards);
            currentRoom = generateRoomId().toUpperCase();
            this.started = true;

            return currentRoom;
        },

        // Adds a player to the current room
        joinGame: function (playerId, name) {
            players[playerId] = {
                name: name,
                board: _.chain(cards)
                    .shuffle()
                    .first(16)
                    .value()
            }
        },

        pullCard: function () {
            return currentGame.shift();
        },

        hasWon: function (playerId) {
            return _.intersection(players[playerId].board, currentGame).length == 0;
        },

        shoutCards: function () {
            var me = this;
            var loop = $interval(function () {
                if (!me.pullCard()) {
                    this.started = false;

                    // triggers the ranOutOfCards event
                    $rootScope.$broadcast('ranOutOfCards');
                    
                    $interval.cancel(loop);
                    return;
                }

                console.log("broadcast", me.pullCard());
            }, 100);
        }
    };

    $http.get('data/data.es.json').success(function (result) {
        $rootScope.cardData = result;
    });
    
    return service;
});