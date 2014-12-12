'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $state, $stateParams, $location, Authentication, ActiveMQ) {
		$scope.authentication = Authentication;

		$scope.hosts = ActiveMQ.rest.hosts();

		$scope.parseQueueName = ActiveMQ.parseQueueName;

		$scope.$watch('host', function(newVal) {
			console.log(newVal);
			$scope.queues = newVal ? ActiveMQ.rest.query({
				host: $scope.host
			}) : [];
		});

		$scope.query = function() {
			$state.go('browseQueues', {
				host: $scope.host,
				queue: $scope.queue
			});
		};
		
		$scope.host = $stateParams.host ? $stateParams.host : '';
		$scope.queue = $stateParams.queue ? $stateParams.queue : '';
		
		if ($stateParams.host && $stateParams.queue) {
			$scope.results = ActiveMQ.rest.query({
				host: $scope.host,
				queue: $scope.queue
			});

			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, ActiveMQ.parseQueueName($scope.queue)].join('/');
		}
		

	}
]);
