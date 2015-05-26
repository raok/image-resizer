/**
 * Created by mario on 25/05/15.
 */

'use strict';

var async = require('async');
var rs = require("./resizer.js").resize;
var sqsCreate = require("./sqsHandler.js")._createQueue;
var sqsSend = require("./sqsHandler.js")._sendMessage;

var fileResizer = {};

fileResizer.rs = function (data, imgName, _dir, sizesObj, obj, callback) {
    async.series([
        function resizeImage (next) {
            async.eachSeries(sizesObj, function (sizesObj, mapNext) {
                rs(data, imgName, _dir, sizesObj, mapNext);
            }, function (err) {
                if (err) {
                    console.log("Error when resizing images, %s", err);
                    next(err);
                } else {
                    console.log("Processing images completed");
                    next(null, "Done resizing");
                }
            });
        },
        function sendSqs (next) {
            sqsSend(obj, next);
        }
    ], function (err) {
        if(err) {
            callback(err);
        } else {
            callback();
        }
    });
};

module.exports = fileResizer;