/**
 * Created by mario on 27/05/15.
 */

'use strict';

var fs = require('fs');

var writeFiles = {};

writeFiles._write = function (fileName, dstFolder, data, imgType, callback) {

    var _fileName = fileName.split("-").shift();
    var _path = dstFolder + _fileName + "/" + _fileName + "." + imgType;


    fs.writeFile(_path, data, function (err) {

        if (err) {
            console.log("Error writing file: %s", err);
            callback(err, null);
        } else {
            console.log("Wrote file.");
            callback();
        }
    })
};

module.exports = writeFiles;
