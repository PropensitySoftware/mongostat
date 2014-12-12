'use strict';

// Setting up route
angular.module('activemq').config(['$stateProvider',
	function($stateProvider) {
		// state routing
		$stateProvider.
		state('browseQueues', {
			url: '/activemq/browse',
			templateUrl: 'modules/activemq/views/browse.client.view.html'
		});
	}
]);
