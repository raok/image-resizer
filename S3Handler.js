/**
 * Created by mario on 12/05/15.
 */

'use strict';

var s3 = new (require('aws-sdk')).S3();
var fs = require('fs');
var async = require('async');

var S3Handler = {};

S3Handler._get = function (bucketName, imgName, callback) {
    var s3Obj;

    s3Obj = s3.getObject({
        Bucket: bucketName,
        Key: imgName
    });

    return callback(null, s3Obj);
};

S3Handler._put = function (bucketName, files, directory, sizesObj, imgName, imageType) {

    //async.map(files, fs.read, function (err, results) {
    //
    //    if ( err ) {
    //        console.error("There was an error in S3put, reading files: %s", err.message);
    //        return;
    //    }
    //
    //
    //    s3.putObject({
    //        Bucket: bucketName,
    //        Key: directory + "/" + sizesObj.name + "/" + imgName,
    //        Body: files,
    //        ContentType: 'image/' + imageType
    //    })
    //
    //
    //});
};
