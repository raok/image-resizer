/**
 * Created by mario on 12/05/15.
 */

/**
 * directory - will always need to end at the images folder: /tmp/images
 */
'use strict';

var fs = require('fs');

var _getFiles = {};

_getFiles._get = function (path, callback) {
    console.log("Called readdir");
    fs.readdir(path, function (error, files) {
        if (error) {
            callback(error, null);
        }
        callback(null, files);
    });
};

_getFiles._getContent = function (file, callback) {
    console.log("called readFile");
    fs.readFile(file, function (error, data) {
        if(error) {
            callback(error, null);
        }
        callback(null, data);
    });
}

module.exports = _getFiles;