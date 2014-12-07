'use strict';

/**
 * Module dependencies.
 */
var
	MongoClient = require('mongodb').MongoClient,
	errorHandler = require('../errors.server.controller'),
	config = require('../../../config/config'),
	keyOccurrenceUtil = require('./keyOccurrenceUtil'),
	_ = require('lodash');


/**
 * Execute a query
 */
exports.getKeyOccurrences = function(req, res) {

	var options = {
		collection: req.param('collection'),
		database: req.param('database'),
		host: req.param('host')
	};

	keyOccurrenceUtil.run(config.mongoHosts[options.host] + '/' + options.database, options, function(result) {
		res.status(200).json(result);
	});

};
