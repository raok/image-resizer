/**
 * Created by mario on 25/05/15.
 */

'use strict';

var async = require('async');
var rs = require("./resizer.js").resize;
var sqsSend = require("./sqsHandler.js")._sendMessage;
var readDirFile = require("./readDirectory.js")._get;
var readDirCont = require("./readDirectory.js")._getContent;
var fileWrite = require("./writeFiles.js")._write;
var tmp = require('tmp');

var fileResizer = {};

fileResizer.rs = function (data, imgName, _dir, sizesObj, obj, imgType, callback) {

    var tmpDir = tmp.dirSync(); //object
    var tmpDirName = tmpDir.name + "/"; //path to directory

    async.series([
        function resizeImage (next) {
            async.eachSeries(sizesObj, function (sizesObj, mapNext) {
                rs(data, imgName, tmpDirName, sizesObj, mapNext);
            }, function (err) {
                if (err) {
                    next(err);
                } else {
                    next(null);
                }
            });
        },
        function processImage (next) {
            async.waterfall([

                function readDir (asyncCallback) {
                    readDirFile(tmpDirName, asyncCallback);
                },
                function readFiles (files, asyncCallback) {

                    async.each(files, function (file, mapNext) {
                        readDirCont(file, tmpDirName, function (error, data) {
                            fileWrite(file, _dir, data, imgType, mapNext);
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
            ], function (err) {
                if(err) {
                    next(err);
                } else {
                    next();
                }
            });
        },
    ], function (err) {
        if(err) {
            callback(err);
        } else {
            callback();
        }
    });
};

module.exports = fileResizer;