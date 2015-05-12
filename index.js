/**
 * Created by mario on 24/02/2015.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');



// module to be exported when in production

'use strict';


var _ = require("underscore");
var s3 = new (require('aws-sdk')).S3();


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