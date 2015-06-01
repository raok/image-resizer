/**
 * Created by mario on 27/05/15.
 */

/**
 * @handler - this function checks for the existence of a directory and creates that directory if it does not exist. If the directory already exists, it simply triggers its callback.
 * @params dstPath type string - the path which we wish to check its existence.
 * @params sizesObj type array of objects - the object containing a list of sizes to check against.
 * @var _path - the full path (original path + sizes) to check against.
 */

'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

var makeDir = {};

makeDir.handler = function (dstPath, sizesObj, callback) {

    var _path = dstPath + sizesObj.name + "/";

    fs.lstat(_path, function (err, stats) {
        if (err) {
            mkdirp(_path, function (err, made) {
                if (err) {
                    console.log("Error creating directory: %s", err);
                    callback (err, null);
                } else {
                    console.log("Created new directory");
                    callback(null, made);
                }
            });
        } else {
            callback(null);
        }
    });
};

module.exports = makeDir;
