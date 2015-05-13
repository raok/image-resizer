/**
 * Created by mario on 12/05/15.
 */

/**
 * directory - will always need to end at the images folder: /tmp/images
 */
'use strict';

var fs = require('fs');
var async = require('async');
var dir = require('node-dir');

var _getFiles = {};

_getFiles._get = function (directory, callback) {

    dir.readFiles(directory,
        function(err, content, next) {
            if (err) {
                callback(err, null);
            }
            callback(null, content);
        });
};

module.exports = _getFiles;