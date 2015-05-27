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
            console.log("Error with readDir");
            callback(error, null);
        }
        callback(null, files);
    });
};

_getFiles._getContent = function (file, dir, callback) {
    fs.readFile(dir + file, function (error, data) {
        if(error) {
            callback(error, null);
        }
        console.log("No error reading file");
        console.log(data);
        callback(null, data);
    });
}

module.exports = _getFiles;