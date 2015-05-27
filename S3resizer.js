/**
 * Created by mario on 22/05/15.
 */

'use strict';

var async = require('async');
var S3get = require("./S3Handler.js")._get;
var S3put = require("./S3Handler.js")._put;
var readDirFile = require("./readDirectory.js")._get;
var readDirCont = require("./readDirectory.js")._getContent;
var rs = require("./resizer.js").resize;
var sqsSend = require("./sqsHandler.js")._sendMessage;

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
                            console.log("Error when resizing images, %s", err);
                            asyncCallback(err);
                        } else {
                            console.log("Processing images completed");
                            asyncCallback(null);
                        }
                    });
                }
            ], function (err, result) {
                if(err) {
                    console.log("Error in first async.waterfall");
                    next(err);
                } else {
                    next(null, result);
                }
            });
        },

        function (next) {
            async.waterfall([

                function readDir (asyncCallback) {
                    console.log("reached readfile");
                    readDirFile(dir, asyncCallback);
                },
                function readFiles (files, asyncCallback) {

                    async.each(files, function (file, mapNext) {
                        readDirCont(file, dir, function (data) {
                            S3put(bucketName, data, file, imgName, imageType, mapNext);
                        });
                    }, function (err) {
                        if (err) {
                            console.log("Error when putting image to S3, %s", err);
                            asyncCallback(err);
                        } else {
                            console.log("Image sent to S3");
                            asyncCallback();
                        }
                    });
                },
                function sendSqs (asyncCallback) {
                    sqsSend(obj, asyncCallback);
                }
            ], function (err) {
                if(err) {
                    next(err);
                } else {
                    next();
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