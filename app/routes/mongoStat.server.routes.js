'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {

	var mongostat = require('../../app/controllers/mongostat.server.controller');
	var users = require('../../app/controllers/users.server.controller');


	// Mongostat Routes
	app.route('/mongostat/')
		.get(users.requiresLogin, mongostat.queryHosts);
	app.route('/mongostat/:host')
		.get(users.requiresLogin, mongostat.queryDatabases);
	app.route('/mongostat/:host/:database/')
		.get(users.requiresLogin, mongostat.queryCollections);


	//Key occurrence routes
	app.route('/mongostat/:host/:database/:collection/keyOccurrences')
		.get(users.requiresLogin, mongostat.getKeyOccurrences);

};
