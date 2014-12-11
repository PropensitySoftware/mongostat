'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Dashboard',
	function($scope, $stateParams, $location, Dashboard) {

		$scope.activemqHosts = Dashboard.activemq();
		$scope.mongoHosts = Dashboard.mongo();
		$scope.mongoTC = Dashboard.mongoTC();

	}
]);
