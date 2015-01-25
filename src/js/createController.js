app.controller('createController', ['$scope', '$location', 'messageService', 'gameState', '$rootScope',
    function($scope, $location, messageService, gameState, $rootScope) {
        $scope.playerName = null;

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };

        $scope.create = function() {
            if ($scope.playerName.length > 0) {
                $rootScope.playerStatus = 'admin';

                gameState.currentPlayerName = $scope.playerName;

                $scope.goTo('players');
            }
        };
    }
]);