'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Dashboard', 'ActiveMQ',
	function($scope, $stateParams, $location, Dashboard, ActiveMQ) {

		$scope.activemqHosts = Dashboard.activemq();
		$scope.mongoHosts = Dashboard.mongo();
		$scope.mongoTC = Dashboard.mongoTC();
		$scope.mongoProfilerSummary = Dashboard.mongoProfilerSummary();
		
		$scope.queues = ActiveMQ.rest.primaryQueueCount();

		$scope.parseQueueName = ActiveMQ.parseQueueName;		
		
	}
]);
