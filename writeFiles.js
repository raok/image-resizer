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
            console.log(err);
            console.log("Error writing to file");
            callback(err, null);
        } else {
            console.log("Written to file");
            callback();
        }
    })
};

module.exports = writeFiles;
