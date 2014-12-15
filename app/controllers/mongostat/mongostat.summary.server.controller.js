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
exports.getTotalCreated = function(req, res) {

	var options = {
		collection: 'formSubmission',
		database: 'FormDB',
		host: req.param('host')
	};
	
	var query = {
		created: { $gte: new Date('2014-11-12T15:00:00.000Z') }
	};
	
	MongoClient.connect(config.mongoHosts.primary + '/' + options.database, function(err, db) {
		db.collection(options.collection).find(query).count(function (err, obj) {
			res.status(200).json(_.extend(query, {count: obj}));
			db.close();
		});
	});
};
