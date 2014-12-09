'use strict';

exports.queryQueues = function(host, cb) {
    cb([1, 2, 3]);
};

exports.queryQueue = function(host, queue, cb) {
    cb([3, 4, 5]);
};
