'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $stateParams, $location, Authentication, ActiveMQ) {
		$scope.authentication = Authentication;

		$scope.hosts = ActiveMQ.query();

		$scope.parseQueueName = function(queueName) {
			return queueName.match(/destinationName=([^,]*)/)[1];
		}

		$scope.$watch('host', function(newVal) {
			$scope.queues = newVal ? ActiveMQ.query({
				host: $scope.host
			}) : [];
		});

		$scope.query = function() {

			$scope.results = ActiveMQ.get({
				host: $scope.host,
				queue: $scope.queue
			});

			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, $scope.queue].join('/');
		};

		$scope.delete = function() {
console.log(deleting);
			ActiveMQ.delete({
				host: $scope.host,
				queue: $scope.queue
			});

			delete $scope.results;
			$scope.queues = [];

			delete $scope.lastSearchTime;
			delete $scope.lastSearch;
		};

	}
]);
