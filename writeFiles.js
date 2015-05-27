/**
 * Created by mario on 27/05/15.
 */

'use strict';

var fs = require('fs');

var writeFiles = {};

writeFiles._write = function (fileName, dstFolder, data, imgType, callback) {

    var _fileName = fileName.split("_").shift();
    var _path = dstFolder + _fileName + "/" + _fileName + "." + imgType;


    fs.writeFile(_path, data, function (err) {

        if (err) {
            callback(err, null);
        } else {
            callback();
        }
    })
};

module.exports = writeFiles;
