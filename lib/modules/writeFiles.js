/**
 * Created by mario on 27/05/15.
 */

/**
 * This function takes four parameters and a callback function. It writes the contents of a file to a specified directory.
 * @params fileName type string - the full name of the file being written (should be 'size-originalName.extension' - e.g 'large-0_33294986.png). It is used to retrieve the size and file name.
 * @params dstFolder type string - the destination folder to which the file will be written. This is the base path to which the sizes fodlers will be added.
 * @params data type buffer - the content of the file
 * @var _sizeName - size of file used to create folder
 * @var _fileName - name of file after resizing has been complete
 */

'use strict';

var fs = require('fs');

var writeFiles = {};

writeFiles._write = function (fileName, dstFolder, data, callback) {

    var _sizeName = fileName.split("-").shift();
    var _fileName = fileName.split("-").pop();
    var _path = dstFolder + _sizeName + "/" + _fileName;

    fs.writeFile(_path, data, function (err) {

        if (err) {
            callback(err, null);
        } else {
            callback();
        }
    })
};

module.exports = writeFiles;
