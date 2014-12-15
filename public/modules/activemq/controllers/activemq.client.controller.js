'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $state, $stateParams, $location, Authentication, ActiveMQ) {
		$scope.authentication = Authentication;

		$scope.$watch('host', function(newVal) {
			$scope.queues = newVal ? ActiveMQ.rest.query({
				host: $scope.host
			}) : [];
		});
		
		$scope.parseQueueName = ActiveMQ.parseQueueName;		

		$scope.hosts = ActiveMQ.rest.hosts();
		
		if ($stateParams.host) {
			$scope.host =  $stateParams.host;		
		}
		
		if ($stateParams.queue) {
			$scope.queue = $stateParams.queue;
		}
		

		$scope.query = function() {
		
			$state.go('browseQueues.results', {
				host: $scope.host,
				queue: $scope.queue
			});
			
			$scope.results = ActiveMQ.rest.query({
				host: $scope.host,
				queue: $scope.queue
			});
			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, ActiveMQ.parseQueueName($scope.queue)].join('/');			

		};

		//If initialized with host and queue, query for queue contents
		if ($scope.host && $scope.queue) {
			$scope.query();
		}
		

	}
]);
