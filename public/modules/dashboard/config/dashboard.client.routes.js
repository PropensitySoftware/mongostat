'use strict';

// Setting up route
angular.module('dashboard').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider
			.state('dashboard', {
				url: '/',
				views: {
					'': {
						templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
					},
					'activemq': {
						templateUrl: 'modules/dashboard/views/activemq/summary.client.view.html'
					},
					'mongo': {
						templateUrl: 'modules/dashboard/views/mongo/summary.client.view.html'
					}
				}

			})
			;
	}
]);
