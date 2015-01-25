app.controller('winnerController', ['$scope',
    function ($scope) {

        $scope.goTo = function (location) {
            $location.path('/' + location);
        };
    }
]);