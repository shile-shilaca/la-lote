app.controller('homeController', ['$scope', '$location', '$anchorScroll', '$rootScope', 'messageService', 'gameState',
    function($scope, $location, $anchorScroll, $rootScope, messageService, gameState) {
    	$rootScope.playerStatus = null;

    	messageService.disconnect();
    	gameState.started = false;

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