/**
 * Created by mario on 27/05/15.
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
                    callback (err, null);
                } else {
                    callback(null, made);
                }
            });
        } else {
            callback(null);
        }
    });
};

module.exports = makeDir;
