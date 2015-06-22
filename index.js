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


    console.log(event);
    console.log(argv);

    if (event) {
        var _path = event.path;
    } else if (!event) {
        var _path = argv.source;
        var _dir = argv.dest;
    }

    console.log("Path, %s", _path);

    console.log(_dir);

    var parts = _getprotocol(_path);

    var imgName = parts.pathname.split("/").pop();

    console.log("imgName: %s", imgName);

    var s3Bucket = parts.hostname;

    var s3Key = imgName;

    var _protocol = parts.protocol;

    console.log(_protocol);

    // RegExp to check for image type
    var imageTypeRegExp = /(?:(jpg)|(png)|(jpeg))$/;

    var sizesConfigs = configs.sizes;

    var obj = createObj(_path);

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(s3Key);

    if (imgExt === null) {
        console.error('unable to infer the image type for key %s', s3Key);
        context.done(new Error('unable to infer the image type for key %s' + s3Key));
        return;
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
                    context.done(error);
                } else {
                    console.log("Everything went well. Calling context.done");
                    context.done(result);
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
            ], function (error, result) {
                if(error) {
                    console.error("Error processing image with path 'file': %s", error);
                    return;
                } else {
                    console.log("Image processed without errors for 'file' path");
                    return;
                }
            });
            break;
        default:
            console.log("No matches found for: %s", _protocol);
    }
};

if (!module.parent) {
    exports.imageRs();
}

