app.controller('winnerController', ['$scope', '$location',
    function($scope, $location) {
        // Play "Loteria" audio
        var audio = new Audio('audio/01.es.mp3');
        audio.play();

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);