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
        return callback(null, data);
    });
};

S3Handler._put = function (bucketName, files, directory, sizesObj, imgName, imageType, callback) {
    return function () {
        files.forEach(
            s3.putObject({
                Bucket: bucketName,
                Key: directory + "/" + sizesObj.name + "/" + imgName,
                Body: files,
                ContentType: 'image/' + imageType
            })
        );
        callback;
    }
};

module.exports = S3Handler;
