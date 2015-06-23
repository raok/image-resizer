/**
 * Created by mario on 25/05/15.
 */

/**
 * This function is called when the protocol defined in index.js is "file:".
 * @rs type function - This function calls a list of functions using the methods 'series', 'waterfall', 'eachSeries' and 'series' from the 'async' module.
 * @params data type string - for this function this is the path to the file being resized.
 * @params imgName type string - the name of the image being resized.
 * @params _dir type string - the destination path to where the resized images will be written.
 * @params sizesObj type array of objects - array of objects containing the properties 'sizes', 'height' and 'width'.
 * @params obj type object - the object being sent in the sqs message to the sqs queue.
 * @var tmpDir type object - the object representing the temporary directory.
 * @var tmpdDirName type string - the path of the temporary directory.
 */

'use strict';

var async = require('async');
var _resizer= require("./resizer");
var resizer = _resizer.resize;
var _sqs = require("./sqsHandler");
var sqsSend = _sqs._sendMessage;
var read = require("./readDirectory");
var readDirFile = read._get;
var readDirCont = read._getContent;
var _fileWrite = require("./writeFiles");
var fileWrite = _fileWrite._write;
var tmp = require('tmp');

var fileResizer = {};

fileResizer.rs = function (data, imgName, _dir, sizesObj, obj, callback) {

    var tmpDir = tmp.dirSync(); //object
    var tmpDirName = tmpDir.name + "/"; //path to directory

    async.series([
        function resizeImage (next) {
            async.each(sizesObj, function (sizesObj, mapNext) {
                resizer(data, imgName, tmpDirName, sizesObj, mapNext);
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
                            fileWrite(file, _dir, data, mapNext);
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
        if(err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = fileResizer;