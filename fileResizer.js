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
 * @params imgtype tupe string - the type of image.
 * @var tmpDir type object - the object representing the temporary directory.
 * @var tmpdDirName type string - the path of the temporary directory.
 */

'use strict';

var async = require('async');
var resizer = require("./resizer").resize;
var sqsSend = require("./sqsHandler")._sendMessage;
var readDirFile = require("./readDirectory")._get;
var readDirCont = require("./readDirectory")._getContent;
var fileWrite = require("./writeFiles")._write;
var tmp = require('tmp');

var fileResizer = {};

fileResizer.rs = function (data, imgName, _dir, sizesObj, obj, imgType, callback) {

    var tmpDir = tmp.dirSync(); //object
    var tmpDirName = tmpDir.name + "/"; //path to directory

    console.log(tmpDirName);

    async.series([
        function resizeImage (next) {
            async.eachSeries(sizesObj, function (sizesObj, mapNext) {
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