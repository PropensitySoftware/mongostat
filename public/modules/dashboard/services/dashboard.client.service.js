'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('dashboard').factory('Dashboard', ['$resource',
	function($resource) {
		return $resource('dashboard', {}, {

			activemq: {
				url: 'dashboard/activemq',
				method: 'GET',
				isArray: true
			},
			mongo: {
				url: 'dashboard/mongo',
				method: 'GET',
				isArray: true
			}

		});
	}
]);
