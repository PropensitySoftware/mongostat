'use strict';

// Setting up route
angular.module('activemq').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('displayActiveMQ', {
			url: '/activemq/display',
			templateUrl: 'modules/activemq/views/activemq.client.view.html'
		});
	}
]);
