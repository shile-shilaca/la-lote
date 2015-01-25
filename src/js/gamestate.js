app.factory('gameState', ['$rootScope', '$interval', function ($rootScope, $interval) {
    var cards = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53'],
        currentGame = [],
        players = [],
        currentRoom = null,
        playerId = null;

    var service = {
        started: false,

        currentPlayerName: null,
        currentGameUID: null,

        // Initializes a room and returns the new room ID
        createGame: function () {
            players = {};
            currentGame = _.shuffle(cards);
            currentRoom = generateUID().toUpperCase();

            // $rootScope.uuid = currentRoom;

            return currentRoom;
        },

        createOwnPlayer: function (name) {
            playerId = generateUID();

            return {
                id: playerId,
                name: name,
                hp: 3,
                board: _.chain(cards)
                    .shuffle()
                    .first(16)
                    .value()
            }

            // this.joinGame(playerId, name);
        },

        getOwnPlayer: function () {
            return players[playerId];
        },

        getPlayers : function () {
            return players;
        },

        getInitialCard: function () {
            return '01';
        },

        removeHp: function () {
            return --this.getOwnPlayer().hp;
        },

        // Adds a player to the current room
        joinGame: function (id, name) {
            players[id] = {
                id: id,
                name: name,
                hp: 3,
                board: _.chain(cards)
                    .shuffle()
                    .first(16)
                    .value()
            }
        },

        pullCard: function () {
            return currentGame.shift();
        },

        hasWon: function (id) {
            return _.intersection(players[id].board, currentGame).length == 0;
        },

        shoutCards: function () {
            var me = this;
            var loop = $interval(function () {
                var card = me.pullCard();
                if (!card) {
                    this.started = false;
                    // triggers the ranOutOfCards event
                    $rootScope.$broadcast('ranOutOfCards');
                    $interval.cancel(loop);
                    return;
                }
                console.log("broadcast", card);
                return card;
            }, 100);
        }
    };

    return service;
}]);
