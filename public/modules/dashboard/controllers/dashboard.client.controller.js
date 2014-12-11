'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Dashboard', 'ActiveMQ',
	function($scope, $stateParams, $location, Dashboard, ActiveMQ) {

		$scope.activemqHosts = Dashboard.activemq();
		$scope.mongoHosts = Dashboard.mongo();
		$scope.mongoTC = Dashboard.mongoTC();
		
		$scope.queues = ActiveMQ.primaryQueueCount();

	}
]);
