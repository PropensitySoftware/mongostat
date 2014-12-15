'use strict';

// Setting up route
angular.module('mongostat').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('inputMongoQuery', {
			url: '/mongostat/keyOccurrences',
			templateUrl: 'modules/mongoStat/views/keyOccurrences.client.view.html'
		});
	}
]);
