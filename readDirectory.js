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

    fs.readdir(path, function (error, files) {
        if (error) {
            console.log("Error reading directory: %s", error);
            callback(error, null);
        }
        callback(null, files);
    });
};

_getFiles._getContent = function (file, dir, callback) {

    var _path = dir + file;
    fs.readFile(_path, function (error, data) {
        if(error) {
            console.log("Error reading files: %s", error);
            callback(error, null);
        }
        callback(null, data);
    });
};

module.exports = _getFiles;