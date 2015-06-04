/**
 * Created by mario on 24/02/2015.
 */

'use strict';


var _ = require("underscore");
var async = require('async');
var _getprotocol = require("./getProtocol").getProtocol;
var s3resizer = require("./S3resizer").rs;
var createObj = require("./objectCreator").creator;
var fileResizer = require("./fileResizer").rs;
var configs = require("./configs.json");
var makeDir = require("./makeDir").handler;



exports.imageRs = function (event, context) {

    var _path = process.argv[2] || event.path;

    var _dir = process.argv[3];

    var parts = _getprotocol(_path);

    var imgName = parts.pathname.split("/").pop();

    console.log("imgName: %s", imgName);

    var s3Bucket = parts.hostname;

    var s3Key = imgName;

    var _protocol = parts.protocol;

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
            ], function (error) {
                if (error) {
                    context.done(error);
                } else {
                    console.log("Everything went well. Calling context.done");
                    context.done();
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
                    fileResizer(_path, imgName, _dir, sizesConfigs, obj, imageType, callback);
                }
            ], function (error, result) {
                if(error) {
                    console.error("Error processing image with path 'file': %s", error);
                } else {
                    console.log("Image processed without errors for 'file' path");
                }
            });
            break;
        default:
            console.log("No matches found for: %s", _protocol);
    }
};

if (!process.env.LAMBDA_TASK_ROOT) {
    exports.imageRs();
}

