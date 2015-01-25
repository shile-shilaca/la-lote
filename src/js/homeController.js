app.controller('homeController', ['$scope', '$location', '$anchorScroll',
    function($scope, $location, $anchorScroll) {
        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);