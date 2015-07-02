/**
 * Created by mario (https://github.com/hyprstack) on 12/05/15.
 */

/**
 * @_get - function that retrieves the contents of the object specified by params 'imgName' and 'bucketName' from an aws S3 bucket.
 * @_put - function that writes the contents of the data passed in corresponding to params 'fileName' to an aws S3 bucket.
 * @params bucketName - type string - name of S3 bucket from which we want to get the desired object or to which we want to write to.
 * @params s3Key - type string - name of file we want to manipulate.
 * @params data - type buffer - actual content of target file. It is the data that will be saved to the S3 bucket.
 * @params fileName type string - name of image after resizing.
 */

'use strict';

var s3 = new (require('aws-sdk')).S3();
var getprotocol = require("./getProtocol");
var _getprotocol = getprotocol.getProtocol;
var fs = require('fs');

var S3Handler = {};

S3Handler._get = function (src, callback) {

    var parts = _getprotocol(src);
    var s3Key = parts.pathname.split("/").pop();
    var bucketName = parts.hostname;


    var params = {
        Bucket: bucketName,
        Key: s3Key
    };

    s3.getObject(params, function (error, data) {
        if (error) {
            callback(error, null);
        }
        callback(null, data);
    });
};

S3Handler._put = function (dest, file, callback) {

    var parts = _getprotocol(dest);
    // manipulate path to remove first "/"
    var _path = parts.pathname.slice(1);

    var bucketName = parts.host;
    var imageType = parts.pathname.split(".").pop();

    getContent(file, function (err, data) {
        var params = {
            Bucket: bucketName,
            Key: _path + file,
            Body: data,
            ContentType: 'image/' + imageType
        };

        s3.putObject(params, function (error, data) {
            if ( error ) {
                callback(error);
            } else {
                callback(data);
            }
        });
    });
};

module.exports = S3Handler;

// read the content of a file and pass data to callback
function getContent (file, callback) {
    fs.readFile(file, function (error, data) {
        if(error) {
            callback(error, null);
        }
        callback(null, data);
    });
};
