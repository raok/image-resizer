/**
 * Created by mario on 12/05/15.
 */

'use strict';

var fs = require('fs');

var _getFiles = {};

_getFiles._get = function (directory, callback) {
    fs.readdir(directory, function (error, files) {
        if ( error ) {
            console.error("Error getting files from directory. %s", error.message);
            return callback(error, null);
        }

        return callback(null, files);
    });
};

module.exports = _getFiles;