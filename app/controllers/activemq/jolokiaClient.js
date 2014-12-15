'use strict';

var
    restify = require('restify'),
    config = require('../../../config/config'),
    _ = require('lodash')
;


exports.getQueueCounts = function(hostKey, cb) {

	exports.queryQueues(hostKey, function(queueList) {
	
		var ops = [];
		queueList.forEach(function(item) {
			ops.push({
				type: 'read',
				mbean: item,
				attribute: 'QueueSize'
			});
		});

		var host = config.activemqHosts[hostKey];
		var client = restify.createJSONClient({
			url: host.url,
			headers: {
				'Authorization': 'Basic ' + new Buffer(host.user + ':' + host.password).toString('base64')
			}
		});
		client.post('', ops, function(err, req, res, obj) {
			if (err) throw err;
			
			var ret = [];
			for (var i in ops) {
				ret.push({
					name: ops[i].mbean,
					count: obj[i].value
				});
			}
			cb(ret);
		});
	});




};


exports.queryQueues = function(hostKey, cb) {
    var host = config.activemqHosts[hostKey];

    var client = restify.createJSONClient({
        url: host.url,
        headers: {
            'Authorization': 'Basic ' + new Buffer(host.user + ':' + host.password).toString('base64')
        }
    });

    var op= {
        type: 'search',
        mbean: '*:destinationType=Queue,*'
    };

    client.post('', op, function(err, req, res, obj) {
        if (err) throw err;
        cb(obj.value.filter(function(item) {return !item.match(/endpoint=/);}));

    });
};

exports.queryQueue = function(hostKey, queue, cb) {
    var host = config.activemqHosts[hostKey];

    var client = restify.createJSONClient({
        url: host.url,
        headers: {
            'Authorization': 'Basic ' + new Buffer(host.user + ':' + host.password).toString('base64')
        }
    });

    var op= {
        type: 'exec',
        mbean: queue,
		operation: 'browse()'
    };

    client.post('', op, function(err, req, res, obj) {
        if (err) throw err;
        cb(obj.value);
    });
};
