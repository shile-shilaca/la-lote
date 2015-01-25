app.controller('homeController', ['$scope', '$location', '$anchorScroll', '$rootScope',
    function($scope, $location, $anchorScroll, $rootScope) {
    	if (!!$rootScope.toast) {
    		showToaster($rootScope.toast);
    		$rootScope.toast = '';
    	}

        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };

        $scope.goTo = function(location) {
            $location.path('/' + location);
        };
    }
]);