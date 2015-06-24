/**
 * Created by mario on 24/02/2015.
 */

'use strict';


var _ = require("underscore");
var async = require('async');
var argv = require("minimist")(process.argv.slice(2));

var getprotocol = require("./getProtocol");
var _getprotocol = getprotocol.getProtocol;

var S3rs = require("./S3resizer");
var s3resizer = S3rs.rs;

var objCr = require("./objectCreator");
var createObj = objCr.creator;

var fileRs = require("./fileResizer");
var fileResizer = fileRs.rs;

var configs = require("./configs.json");

var mkDir = require("./makeDir");
var makeDir = mkDir.handler;


exports.imageRs = function (event, context) {

    if (event) {
        var _path = event.path;
    } else if (!event) {
        var _path = argv.source;
        var _dir = argv.dest;
    }

    // get parts of passed file path
    var parts = _getprotocol(_path);

    // get image name
    var imgName = parts.pathname.split("/").pop();

    // get bucket name
    var s3Bucket = parts.hostname;

    var s3Key = imgName;

    // get protocol
    var _protocol = parts.protocol;

    // RegExp to check for image type
    var imageTypeRegExp = /(?:(jpg)|(png)|(jpeg))$/;

    // use configs file
    var sizesConfigs = configs.sizes;

    var obj = createObj(_path);

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(s3Key);

    if (imgExt === null) {
        if(!context) {
            return console.error('Unable to infer the image type for key ' + s3Key);
        } else if (context) {
            context.done(new Error('unable to infer the image type for key ' + s3Key), null);
        }
    }

    var imageType = imgExt[1] || imgExt[2];

    switch(_protocol) {
        case "s3:":
            async.waterfall([
                function(callback) {
                    s3resizer(s3Key, s3Bucket, sizesConfigs, imageType, obj, callback);
                }
            ], function (error, result) {
                if (error) {
                    context.done(error, null);
                } else {
                    console.log("Everything went well. Calling context.done");
                    context.done(null, result);
                }
            });
            break;
        case "file:":
            async.series([
                function (callback) {
                    async.eachSeries(sizesConfigs, function (item, mapNext) {
                        makeDir(_dir, item, mapNext);
                    }, function (err) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    fileResizer(_path, imgName, _dir, sizesConfigs, obj, callback);
                }
            ], function (error, results) {
                if(error) {
                    console.log("Error in file, %s", error);
                    return error;
                } else {
                    return console.log("Image processed without errors for 'file' path.");
                }
            });
            break;
        default:
            return console.log("No matches found for: %s", _protocol);
    }
};

if (!module.parent) {
    exports.imageRs();
}

