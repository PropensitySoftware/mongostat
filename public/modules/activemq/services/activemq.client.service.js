'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('activemq').factory('ActiveMQ', ['$resource',
	function($resource) {
		return $resource('activemq/:host/:queue', {}, {

		});
	}
]);