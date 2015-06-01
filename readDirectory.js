/**
 * Created by mario on 12/05/15.
 */

/**
 * @_get - function that reads the directory specified by param 'path' and returns a list of file names
 * @_getContent - function that returns the content of the file passed as param 'file'
 * @params path type string - path to directory where target files are stored
 * @params file type string - name of file of which we want content
 * @params dir type string - path of directory where the target file is stored. Must end with '/'.
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