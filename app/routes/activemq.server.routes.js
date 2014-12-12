'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {

	var activemq = require('../../app/controllers/activemq.server.controller');
	var users = require('../../app/controllers/users.server.controller');


	// Mongostat Routes
	app.route('/activemq/')
		.get(users.requiresLogin, activemq.queryHosts);
	app.route('/activemq/:host/queues')
		.get(users.requiresLogin, activemq.queryQueues);
	app.route('/activemq/:host/queues/:queue/')
		.get(users.requiresLogin, activemq.queryQueue);
	app.route('/activemq/:host/counts/')
		.get(activemq.getQueueCounts);


};
