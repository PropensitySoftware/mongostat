'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $stateParams, $location, Authentication, ActiveMQ) {
		$scope.authentication = Authentication;

		$scope.hosts = ActiveMQ.query();

		$scope.$watch('host', function(newVal) {
			$scope.queues = newVal ? ActiveMQ.query({
				host: $scope.host
			}) : [];
		});

		$scope.query = function() {

			$scope.results = ActiveMQ.query({
				host: $scope.host,
				queue: $scope.queue
			});

			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, $scope.queue].join('/');
		}

	}
]);
