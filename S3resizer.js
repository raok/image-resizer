/**
 * Created by mario on 22/05/15.
 */

'use strict';

var async = require('async');
var S3get = require("./S3Handler.js")._get();
var S3put = require("./S3Handler.js")._put();
var readDirFile = require("./readDirectory.js")._get();
var readDirCont = require("./readDirectory.js")._getContent();
var rs = require("./resizer.js").resize();
var sqsCreate = require("./sqsHandler.js")._createQueue();
var sqsSend = require("./sqsHandler.js")._sendMessage();

var S3resizer = {};

S3resizer.rs = function (imgName, bucketName, sizesObj, imageType, obj, context) {

    var dir = "/tmp";

    async.waterfall([
        function (callback) {
            S3get(bucketName, imgName, callback);
        },
        function (data, callback) {
            rs(data, imgName, dir, sizesObj, callback);
        },
        function (callback) {
            readDirFile(dir, callback);
        },
        function (files, callback) {
            async.map(files, function (file, mapNext) {
                readDirCont(file, function (data) {
                    S3put(bucketName, data, file, imgName, imageType, mapNext);
                });
            }, callback);
        },
        function (callback) {
            sqsCreate(callback);
        },
        function (obj, callback) {
            sqsSend(obj, callback);
        }
    ], function (error) {
        if(error) {
            context.done(error);
        } else {
            context.done(null);
        }
    });
};

module.exports = S3resizer;