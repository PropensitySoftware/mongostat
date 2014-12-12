'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('activemq').factory('ActiveMQ', ['$resource',
	function($resource) {
		return {
			parseQueueName: function(queueName) {
				return queueName.match(/destinationName=([^,]*)/)[1];
			},
			rest: $resource('activemq/:host/queues/:queue', {}, {
				primaryQueueCount: {
					url: 'activemq/primary/counts',
					method: 'GET',
					isArray: true
				}, 
				hosts: {
					url: 'activemq/:host',
					method: 'GET',
					isArray: true			
				}
			})
		}
	}
]);
