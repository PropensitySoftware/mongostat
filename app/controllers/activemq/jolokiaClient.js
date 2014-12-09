'use strict';

var
    restify = require('restify'),
    config = require('../../../config/config'),
    _ = require('lodash')
;

exports.queryQueues = function(hostKey, cb) {
    var host = config.activemqHosts[hostKey];

    var client = restify.createJSONClient({
        url: host.url,
        headers: {
            'Authorization': 'Basic ' + new Buffer(host.user + ':' + host.password).toString('base64')
        }
    });

    var search= {
        type: 'search',
        mbean: '*:destinationType=Queue,*'
    };

    client.post('', search, function(err, req, res, obj) {
        if (err) throw err;
        console.log(res.statusCode);
        console.log(obj);
        cb(_.map(obj.value, function(item) {
            return item;
        }));

    });
};

exports.queryQueue = function(hostKey, queue, cb) {
    cb([3, 4, 5]);
};
