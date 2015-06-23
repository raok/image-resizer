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

var S3Handler = {};

S3Handler._get = function (bucketName, imgName, callback) {

    var params = {
        Bucket: bucketName,
        Key: imgName
    };

    s3.getObject(params, function (error, data) {
        if (error) {
            callback(error, null);
        }
        callback(null, data);
    });
};

S3Handler._put = function (bucketName, content, fileName, imgName, imageType, callback) {

    console.log(fileName);

    var _sizeName = fileName.split("-").shift();

    var params = {
        Bucket: bucketName,
        Key: "images/" + _sizeName + "/" + imgName,
        Body: content,
        ContentType: 'image/' + imageType
    };

    s3.putObject(params, function (error, data) {
        if ( error ) {
            callback(error, null);
        }
        callback(null, data);
    });
};

module.exports = S3Handler;
