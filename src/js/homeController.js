app.controller('homeController', ['$scope', '$location', '$anchorScroll',
    function ($scope, $location, $anchorScroll) {
        // Scroll to section
        $scope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };
        // Go to (New Game or Join an Existing Game)
        $scope.goTo = function (location, action) {
            if (action) {
                $location.path('/' + location + '/' + action);
            } else {
                $location.path('/' + location);
            }
        };
    }
]);