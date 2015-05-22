/**
 * Created by mario on 24/02/2015.
 */

'use strict';


var _ = require("underscore");
var _protocol = require("./getProtocol.js").getProtocol();
var s3resizer = require("./S3resizer.js");
var createObj = require("./objectCreator.js").creator();



exports.imageRs = function (event, context) {

    var parts = _protocol(event.path);

    var imgName = parts.pathname.split("/").pop();

    var s3Bucket = parts.hostname;
    var s3Key = imgName;

    var protocol = parts.protocol;

    // RegExp to check for image type
    var imageTypeRegExp = /(?:(jpg)e?|(png))$/;

    var sizesConfigs = event.sizes;

    var obj = createObj(event.path, sizesConfigs);

    // Check if file has a supported image extension
    var imgExt = imageTypeRegExp.exec(s3Key);

    if (imgExt === null) {
        console.error('unable to infer the image type for key %s', s3Key);
        context.done(new Error('unable to infer the image type for key %s' + s3Key));
        return;
    }

    var imageType = imgExt[1] || imgExt[2];

    if (protocol === "S3") {
        s3resizer(s3Key, s3Bucket, sizesConfigs, imageType, obj, context);
    }

    if (protocol === "file") {

    }

    //async.waterfall([
    //    function download(callback) {
    //        s3.getObject({
    //            Bucket: s3Bucket,
    //            Key: s3Key
    //        }, callback);
    //    },
    //
    //    function transform(response, callback) {
    //        async.map(sizesConfigs, function (sizeConfig, mapNext) {
    //            gm(response.Body, s3Key)
    //                .resize(sizeConfig.width)
    //                .toBuffer(imageType, function (err, buffer) {
    //                    if (err) {
    //                        console.log("err %s", err);
    //                        mapNext(err);
    //                        return;
    //                    }
    //
    //                    s3.putObject({
    //                        Bucket: s3Bucket,
    //                        Key: sizeConfig.size + "_" + s3Key,
    //                        Body: buffer,
    //                        ContentType: 'image/' + imageType
    //                    }, mapNext)
    //                });
    //        }, callback);
    //    },
    //], function (err) {
    //    if (err) {
    //        console.error('Error processing image, details %s', err.message);
    //        context.done(err);
    //    } else {
    //        context.done(null);
    //    }
    //});
};