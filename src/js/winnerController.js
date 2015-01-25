app.controller('winnerController', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
    	if (!$rootScope.winner) {
            $location.path('/');
            return;
        }

        // Play "Loteria" audio
        var audio = new Audio('audio/01.mp3');
        audio.play();

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);