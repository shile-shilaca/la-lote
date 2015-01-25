app.controller('winnerController', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
    	if (!$rootScope.winner) {
            $location.path('/');
            return;
        }

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);