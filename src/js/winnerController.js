app.controller('winnerController', ['$scope', '$location',
    function ($scope, $location) {

        $scope.goTo = function (location) {
            $location.path('/' + location);
        };
    }
]);