'use strict';


var
	MongoClient = require('mongodb').MongoClient,
	errorHandler = require('./errors.server.controller'),
	config = require('../../config/config'),
	_ = require('lodash');

module.exports = _.extend(
	require('./mongostat/mongostat.keyOccurrences.server.controller')
);


/**
 * Get collections
 */
module.exports.queryCollections = function(req, res) {
	var database = req.param('database');
	var host = req.param('host');
	MongoClient.connect(config.mongoHosts[host] + '/' + database, function(err, db) {
		db.listCollections(function (err, collections) {
			res.json(collections.map(
				function (ele) {
					var name = ele.name;
					return name.substring(name.lastIndexOf('.') + 1);
				}));
			db.close();
		});
	});
};


/**
 * Get databases
 */
module.exports.queryDatabases = function(req, res) {

	MongoClient.connect(config.mongoHosts[req.param('host')], function(err, db) {
		db.admin().listDatabases(function (err, dbs) {
			res.json(
				_.map(dbs.databases, function(ele) {return ele.name;})
			);
			db.close();
		});
	});
};


/**
 * Get hosts
 */
module.exports.queryHosts = function(req, res) {
	res.send(
		_.keys(config.mongoHosts)
	);
};
