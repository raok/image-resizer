/**
 * Created by mario on 24/02/2015.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var apiCaller = require("./apiCaller");
var apiGet = apiCaller._get;
var apiPost = apiCaller._post;


// handler for dev environment

exports.GruntHandler = function (filepath, _sizesArray, config) {

    var len = _sizesArray.length;

    // get the file name
    var srcFile = filepath.split("/").pop();

    var dstnFile = "dst";

    // RegExp to check for image type
    var imageTypeRegExp = /(?:(jpg)e?|(png))$/;

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(srcFile);

    if (!imgExt) {
        console.error('Unable to infer image type for key %s', srcFile);
        return;
    }

    async.series([

        function (callback) {
            apiGet(null, config, callback);
        },

        function (callback) {
            async.map(_sizesArray, function (_sizesArray, mapNext) {
                gm(filepath)
                    .resize(_sizesArray.width)
                    .write(dstnFile + "/" + _sizesArray.size + "/" + srcFile, function (err) {
                        if (!err) {
                            console.log("Success");
                        } else {
                            console.error("Error resizing image, %s", err.message);
                            mapNext(err);
                            return;
                        }
                    });
            }, callback());
        },

        function (callback) {
            apiPost(srcFile, _sizesArray, null, config, callback);
        }
    ]);
};


// module to be exported when in production

'use strict';

var s3 = new (require('aws-sdk')).S3();
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var _ = require("underscore");
var apiCaller = require("./apiCaller");
var apiGet = apiCaller._get;
var apiPost = apiCaller._post;
var configs = require("./oauthConfigs");



// RegExp to check for image type
var imageTypeRegExp = /(?:(jpg)e?|(png))$/;

var sizesConfigs = [
    { width: 800, destinationPath: 'large' },
    { width: 500, destinationPath: 'medium' },
    { width: 200, destinationPath: 'small' },
    { width: 45, destinationPath: 'thumbnail'}
];

exports.AwsHandler = function (event, context) {
    var s3Bucket = event.Records[0].s3.bucket.name;
    var s3Key = event.Records[0].s3.object.key;


    var imgId = s3Key.split(".").shift().split("_").pop();

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(s3Key);

    if (imgExt === null) {
        console.error('unable to infer the image type for key %s', s3Key);
        context.done(new Error('unable to infer the image type for key %s' + s3Key));
        return;
    }

    var imageType = imgExt[1] || imgExt[2];

    async.waterfall([
        function _get (next) {
            apiGet(context, configs, next);
        },
        function download(next) {
            s3.getObject({
                Bucket: s3Bucket,
                Key: s3Key
            }, next);
        },
        function transform(response, next) {
            async.map(sizesConfigs, function (sizeConfig, mapNext) {
                gm(response.Body, s3Key)
                    .resize(sizeConfig.width)
                    .toBuffer(imageType, function (err, buffer) {
                        if (err) {
                            mapNext(err);
                            return;
                        }

                        s3.putObject({
                            Bucket: s3Bucket,
                            Key: sizeConfig.size + s3Key,
                            Body: buffer,
                            ContentType: 'image/' + imageType
                        }, mapNext)
                    });
            }, next);
        },
        function _post (next) {
            apiPost(imgId, sizesConfigs, context, configs, next);
        }
    ], function (err) {
        if (err) {
            console.error('Error processing image, details %s', err.message);
            context.done(err);
        } else {
            context.done();
        }
    });
};