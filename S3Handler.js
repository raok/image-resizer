/**
 * Created by mario on 12/05/15.
 */

/**
 * @_get - function that retrieves the contents of the object specified by params 'imgName' and 'bucketName' from an aws S3 bucket.
 * @_put - function that writes the contents of the data passed in corresponding to params 'fileName' to an aws S3 bucket.
 * @params bucketName type string - name of S3 bucket from which we want to get the desired object or to which we want to write to.
 * @params imgName type string - name of file before image manipulation. This is the object we want to manipulate.
 * @params content type buffer - actual content of target file. It is the data that will be saved to the S3 bucket.
 * @params imageType type string - type of image being saved (e.g 'png;, 'jpg', 'jpeg').
 * @params fileName type string - complete name of image after resizing ('large-0_02348923.jpg').
 * @var _sizeName - name of folder where we will store files according to size.
 * @property Key in var params - This is the full path with file name of the file being saved or read from the S3 bucket.
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

function getContent (file, callback) {
    fs.readFile(file, function (error, data) {
        if(error) {
            callback(error, null);
        }
        callback(null, data);
    });
};
