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
 * Get total created cases
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

/**
 * Get simple profiler statistics
 */
exports.getProfilerSummary = function(req, res) {

	var options = {
		collection: 'system.profile',
		database: 'profDump',
		host: req.param('host')
	};
	
	MongoClient.connect(config.mongoHosts.primary + '/' + options.database, function(err, db) {
		var collection = db.collection(options.collection);
		db.collection(options.collection).group(
			{op: 1},
			{},
			{
				min: 99999999999,
				max: -99999999999,
				count: 0,
				total: 0
			},
			function(curr, result) {
				result.count++;
				result.total += curr.millis;
				if (curr.millis > result.max) {
					result.max = curr.millis;
				}
				if (curr.millis < result.min) {
					result.min = curr.millis;
				}
			},
			function(result) {
				result.avg = result.total / result.count;
			},
			function(err, result) {
				if (err) throw err;
				res.status(200).json(result);
			}
		);
	});
};