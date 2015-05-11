/**
 * Created by mario on 24/02/2015.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');


// handler for dev environment

exports.GruntHandler = function (filepath, _sizesArray) {

    // get the file name
    var srcFile = filepath.split("/").pop();

    // RegExp to check for image type
    var imageTypeRegExp = /(?:(jpg)e?|(png))$/;

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(srcFile);

    if (!imgExt) {
        console.error('Unable to infer image type for key %s', srcFile);
        return;
    }


    async.map(_sizesArray, function (_sizesArray, mapNext) {
        gm(filepath)
            .resize(_sizesArray.width)
            .write(_sizesArray.size + "_" + srcFile, function (err) {
                if (!err) {
                    console.log("Success");
                } else {
                    console.error("Error resizing image, %s", err.message);
                    mapNext(err);
                    return;
                }
            });
    });
};


// module to be exported when in production

'use strict';

var s3 = new (require('aws-sdk')).S3();
var _ = require("underscore");


exports.AwsHandler = function (event, context) {
    var s3Bucket = event.Records[0].s3.bucket.name;
    var s3Key = event.Records[0].s3.object.key;

    // RegExp to check for image type
    var imageTypeRegExp = /(?:(jpg)e?|(png))$/;

    var sizesConfigs = [
        { width: 800, size: 'large' },
        { width: 500, size: 'medium' },
        { width: 200, size: 'small' },
        { width: 45, size: 'thumbnail'}
    ];

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(s3Key);

    if (imgExt === null) {
        console.error('unable to infer the image type for key %s', s3Key);
        context.done(new Error('unable to infer the image type for key %s' + s3Key));
        return;
    }

    var imageType = imgExt[1] || imgExt[2];

    async.waterfall([
        function download(callback) {
            s3.getObject({
                Bucket: s3Bucket,
                Key: s3Key
            }, callback);
        },

        function transform(response, callback) {
            async.map(sizesConfigs, function (sizeConfig, mapNext) {
                gm(response.Body, s3Key)
                    .resize(sizeConfig.width)
                    .toBuffer(imageType, function (err, buffer) {
                        if (err) {
                            console.log("err %s", err);
                            mapNext(err);
                            return;
                        }

                        s3.putObject({
                            Bucket: s3Bucket,
                            Key: sizeConfig.size + "_" + s3Key,
                            Body: buffer,
                            ContentType: 'image/' + imageType
                        }, mapNext)
                    });
            }, callback);
        },
    ], function (err) {
        if (err) {
            console.error('Error processing image, details %s', err.message);
            context.done(err);
        } else {
            context.done(null);
        }
    });
};