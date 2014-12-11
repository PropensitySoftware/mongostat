'use strict';


var
	jc = require('./activemq/jolokiaClient'),
	errorHandler = require('./errors.server.controller'),
	config = require('../../config/config'),
	_ = require('lodash');

module.exports = _.extend(
	{}
	//require('./activemq/activemq.util.server.controller')
);


/**
 * Get queue counts
 */
module.exports.getQueueCounts = function(req, res) {
	var host = req.param('host');
	jc.getQueueCounts(host, function(result) {
		res.json(result);
	});
};


/**
 * Get a queue
 */
module.exports.queryQueue = function(req, res) {
	var queue = req.param('queue');
	var host = req.param('host');
	jc.queryQueue(host, queue, function(result) {
		res.json(result);
	});
};


/**
 * Get queues
 */
module.exports.queryQueues = function(req, res) {
	var host = req.param('host');
	jc.queryQueues(host, function(result) {
		res.json(result);
	});
};


/**
 * Get hosts
 */
module.exports.queryHosts = function(req, res) {
	res.send(
		_.keys(config.activemqHosts)
	);
};
