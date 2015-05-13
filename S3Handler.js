/**
 * Created by mario on 12/05/15.
 */

'use strict';

var s3 = new (require('aws-sdk')).S3();

var S3Handler = {};

S3Handler._get = function (bucketName, imgName, callback) {

    var params = {
        Bucket: bucketName,
        Key: imgName
    };

    s3.getObject(params, function (error, data) {
        if (error) {
            return callback(error, null);
        }
        return callback(null, data, imgName);
    });
};

S3Handler._put = function (bucketName, content, sizesObj, imgName, imageType, callback) {
    return function () {
        files.forEach(
            s3.putObject({
                Bucket: bucketName,
                Key: "images/" + sizesObj.name + "/" + imgName,
                Body: content,
                ContentType: 'image/' + imageType
            })
        );
        callback;
    }
};

module.exports = S3Handler;
