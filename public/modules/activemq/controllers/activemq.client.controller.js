'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $state, $stateParams, $location, Authentication, ActiveMQ) {
	
		$scope.authentication = Authentication;

		$scope.$watch('host', function(newVal) {
			console.log(newVal + ' changed');
			$scope.queues = newVal ? ActiveMQ.rest.query({
				host: $scope.host
			}) : [];
		});
		
		$scope.parseQueueName = ActiveMQ.parseQueueName;		

		$scope.hosts = ActiveMQ.rest.hosts();
		
		$scope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
			
				$scope.host = toParams.host;
				$scope.queue = toParams.queue;
			
				//If initialized with host and queue, query for queue contents
				if (toParams.host && toParams.queue) {
					$scope.results = ActiveMQ.rest.query({
						host: $scope.host,
						queue: $scope.queue
					});
					$scope.lastSearchTime = new Date();
					$scope.lastSearch = [$scope.host, ActiveMQ.parseQueueName($scope.queue)].join('/');	
				} else {
					delete $scope.lastSearchTime;
					delete $scope.lastSearch;
				}
			}
		);
	}
]);
