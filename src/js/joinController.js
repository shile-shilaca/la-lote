app.controller('joinController', ['$scope', '$location', 'messageService', 'gameState', '$rootScope',
    function($scope, $location, messageService, gameState, $rootScope) {
        $scope.gameCode = null;
        $scope.playerName = null;

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };

        $scope.join = function() {
            $rootScope.playerStatus = 'player';

            gameState.currentPlayerName = $scope.playerName;
            gameState.currentGameUID = $scope.gameCode;

            $scope.goTo('players');
        };
    }
]);