'use strict';




var MongoClient = require('mongodb').MongoClient,
    Async = require('async'),
    _ = require('lodash')
    ;



function mongostatTypeOf (thing) {
    if (typeof thing === 'undefined') {
        throw 'mongostatTypeOf() requires an argument';
    }

    if (typeof thing !== 'object') {
        // the messiness below capitalizes the first letter, so the output matches
        // the other return values below. -JC
        return (typeof thing)[0].toUpperCase() + (typeof thing).slice(1);
    }
    else {
        if (thing && thing.constructor === Array) {
            return 'Array';
        }
        else if (thing === null) {
            return 'null';
        }
        else if (thing instanceof Date) {
            return 'Date';
        }
        else {
            return 'Object';
        }
    }
}

//flattens object keys to 1D. i.e. {'key1':1,{'key2':{'key3':2}}} becomes {'key1':1,'key2.key3':2}
//we assume no '.' characters in the keys, which is an OK assumption for MongoDB
function serializeDoc(doc, maxDepth) {
    console.log(doc);
    console.log(_.keys(doc));
    var result = {};

    //determining if an object is a Hash vs Array vs something else is hard
    //returns true, if object in argument may have nested objects and makes sense to analyse its content
    function isHash(v) {
        var isArray = Array.isArray(v);
        var isObject = typeof v === 'object';
        return isArray || isObject;
    }

    function serialize(document, parentKey, maxDepth) {
        console.log(document);
        var keys = _.keys(document);
        keys.forEach(function(key) {

            var value = document[key];
            //objects are skipped here and recursed into later
            //if(typeof value != 'object')
            result[parentKey + key] = value;
            //it's an object, recurse...only if we haven't reached max depth
            console.log(key + ' ' + isHash(value));
            if (isHash(value) && (maxDepth > 1)) {
                serialize(value, parentKey + key + '.', maxDepth - 1);
            }
        });
    }

    serialize(doc, '', maxDepth);
    return result;
}




exports.run = function(db, options, callback) {

    MongoClient.connect(db, function(err, db) {

        if (err) {
            console.log(err);
            throw err;
        }

        var collection = options.collection;
        var query = options.query || {} ;
        var limit = options.limit || db.collection(collection).count();
        var maxDepth = options.maxDepth || 99;
        var sort = options.sort || {_id: -1};

        var numDocuments = 0;
        var results = {}; //hold results here until converted to final format

        db.collection(collection).find(query).each(function (err, obj) {

            if (obj === null) {

                Async.each(_.keys(results), function(key, cb) {

                    var existsQuery = {};
                    existsQuery[key] = {$exists: true};
                    db.collection(collection).find(existsQuery).count(function(err, ct) {
                        results[key].totalOccurrences = ct;
                        results[key].percentContaining = (ct / numDocuments) * 100.0;
                        cb(null);
                    });
                },
                function(err) {
                    db.close();
                    var ret = [];
                    for (var key in results) {
                        results[key].name = key;
                        ret.push(results[key]);
                    }
                    callback(ret);
                });

            } else {
                numDocuments++;
                console.log(obj);
                var flattened = serializeDoc(obj, maxDepth);
                for (var key in flattened) {
                    console.log(key);
                    var value = flattened[key];

                    //translate unnamed object key from {_parent_name_}.{_index_} to {_parent_name_}.XX
                    key = key.replace(/\.\d+/g, '.XX');

                    var valueType = mongostatTypeOf(value);
                    if (!(key in results)) { //if it's a new key we haven't seen yet
                        //for the moment, store 'types' as a dictionary.  An easy way to prevent duplicates
                        var newEntry = {'types': {}, 'totalOccurrences': 1};
                        newEntry.types[valueType] = true;
                        results[key] = newEntry;
                    }
                    else { //we've seen this key before
                        results[key].types[valueType] = true;
                        results[key].totalOccurrences++;
                    }
                }
            }
        });
    });
};
