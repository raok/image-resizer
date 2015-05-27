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
            console.log("Error with readDir");
            callback(error, null);
        }
        console.log("Read directory");
        console.log(files);
        callback(null, files);
    });
};

_getFiles._getContent = function (file, dir, callback) {

    var _path = dir + file;
    fs.readFile(_path, function (error, data) {
        if(error) {
            callback(error, null);
        }
        console.log("Read files");
        console.log(data);
        callback(null, data);
    });
};

module.exports = _getFiles;