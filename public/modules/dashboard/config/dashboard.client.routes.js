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
					'dailyCounts': {
						templateUrl: 'modules/dashboard/views/dailyCounts.client.view.html'
					},
					'activemq': {
						templateUrl: 'modules/dashboard/views/activemq/summary.client.view.html'
					},
					'activemqDetail': {
						templateUrl: 'modules/dashboard/views/activemq/detail.client.view.html'
					},					
					'mongo': {
						templateUrl: 'modules/dashboard/views/mongo/summary.client.view.html'
					},
					'mongoDetail': {
						templateUrl: 'modules/dashboard/views/mongo/detail.client.view.html'
					}
				}

			})
			;
	}
]);
