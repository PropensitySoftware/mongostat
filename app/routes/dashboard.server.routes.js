'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var activemq = require('../../app/controllers/activemq.server.controller');
	var mongostat = require('../../app/controllers/mongoStat.server.controller');

	//activeMQ routes
	app.route('/dashboard/activemq').get(activemq.queryHosts);


	//mongo routes
	app.route('/dashboard/mongo').get(mongostat.queryHosts);


};
