'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('mongostat').factory('Mongostat', ['$resource',
	function($resource) {
		return $resource('mongostat/:host/:database/:collection', {}, {
			keyOccurrences: {
				url: 'mongostat/:host/:database/:collection/keyOccurrences',
				isArray: true
			}
		});
	}
]);
