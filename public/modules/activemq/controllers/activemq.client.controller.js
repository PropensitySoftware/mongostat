'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $stateParams, $location, Authentication, ActiveMQ) {
		$scope.authentication = Authentication;

		$scope.hosts = ActiveMQ.rest.hosts();

		$scope.parseQueueName = ActiveMQ.parseQueueName;

		$scope.$watch('host', function(newVal) {
			$scope.queues = newVal ? ActiveMQ.rest.query({
				host: $scope.host
			}) : [];
		});

		$scope.query = function() {

			$scope.results = ActiveMQ.rest.get({
				host: $scope.host,
				queue: $scope.queue
			});

			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, $scope.queue].join('/');
		};

	}
]);
