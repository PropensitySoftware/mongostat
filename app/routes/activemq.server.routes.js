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
	app.route('/activemq/:host')
		.get(users.requiresLogin, activemq.queryQueues);
	app.route('/activemq/:host/:queue/')
		.get(users.requiresLogin, activemq.queryQueue);


};
