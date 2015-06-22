/**
 * Created by mario on 22/05/15.
 */

/**
 * This function is called when the protocol defined in index.js is "s3:".
 * @async.series - is used when we want to call a list of functions in a series, the next being called only once the previous has finished running.
 * @async.waterfall - is used like 'async.series' but passed the results form the first function to the next second.
 * @async.eachSeries - applies the function to each item in the array in series. the iterator functions will end in order.
 * @fs type function - This function calls a list of functions using the methods 'series', 'waterfall', 'eachSeries' and 'series' from the 'async' module.
 * @params imgName type string - the original name of the file to be manipulated.
 * @params bucketName type string - the name of the S3 bucket that will be used.
 * @params sizesObj type array of objects - the object containing the list of sizes we wish to resize our object too.
 * @params imageType type string - the type of image.
 * @params obj type object - the object being sent in the sqs message to the sqs queue.
 * @var dir - is set to '/tmp/' as this is the path to the temporary directory on aws lambda where this function will run.
 */

'use strict';

var async = require('async');
var S3 = require("./S3Handler");
var S3get = S3._get;
var S3put = S3._put;
var read = require("./readDirectory");
var readDirFile = read._get;
var readDirCont = read._getContent;
var _resizer= require("./resizer");
var rs = _resizer.resize;
var _sqs = require("./sqsHandler");
var sqsSend = _sqs._sendMessage;

var S3resizer = {};

S3resizer.rs = function (imgName, bucketName, sizesObj, imageType, obj, cb) {

    var dir = "/tmp/";

    async.series([
        function (next) {

            async.waterfall([
                function getData (asyncCallback) {
                    S3get(bucketName, imgName, asyncCallback);
                },
                function resizeImg (data, asyncCallback) {

                    async.eachSeries(sizesObj, function (item, mapNext) {
                        rs(data, imgName, dir, item, mapNext);
                    }, function (err) {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            asyncCallback(null);
                        }
                    });
                }
            ], function (err, result) {
                if(err) {
                    next(err, null);
                } else {
                    next(null, result);
                }
            });
        },

        function (next) {
            async.waterfall([

                function readDir (asyncCallback) {
                    readDirFile(dir, asyncCallback);
                },
                function readFiles (files, asyncCallback) {

                    async.each(files, function (file, mapNext) {
                        readDirCont(file, dir, function (data) {
                            S3put(bucketName, data, file, imgName, imageType, mapNext);
                        });
                    }, function (err) {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            asyncCallback();
                        }
                    });
                },
                function sendSqs (asyncCallback) {
                    sqsSend(obj, asyncCallback);
                }
            ], function (err, result) {
                if(err) {
                    next(err, null);
                } else {
                    next(null, result);
                }
            });
        }
    ], function (err, results) {
        if (err) {
            cb(err);
        } else {
            cb(null, results);
        }
    });
};

module.exports = S3resizer;