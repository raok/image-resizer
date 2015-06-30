/**
 * Created by mario on 11/05/15.
 */

/**
 * @resize - this function takes an image and resizes it according to a sizes object containing the sizes details and writes it to the indicated directory.
 * @params data type data - the content of the file being read.
 * @params imgName type string - the name of the image being resized.
 * @params directory type string - the directory to which the image will be written.
 * @params sizesObj type array of objects - an object containing the sizes to which the image will be manipulated. This object must contain properties "name", "width" and "height". This object is defined in file 'configs.json'.
 * @var _data - can either be an object containing the 'Body' property where content of file is located, or a valid path to the target file.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });
var tmp = require('tmp');
var async = require('async');
var fs = require('fs');

var resizer = {};

resizer.resize = function (path, sizesObj, callback) {

    var directory = createTmpFile();

    var imgType = path.split(".").pop();

    async.each(sizesObj, function (sizesObj, mapNext) {
        gm(path)
            .resize(sizesObj.width, sizesObj.height)
            .write(directory + sizesObj.name + "." + imgType, function (err) {
                if (err) {
                    mapNext(err);
                }
                mapNext();
            });
    }, function (err) {
        if(err) {
            callback(err);
        } else {
            callback(directory);
        }
    });
};

// This function creates a temporary directory to which we will save our files.
function createTmpFile() {

    var tmpDir = tmp.dirSync(); //object
    var tmpDirName = tmpDir.name + "/"; //path to directory
    return tmpDirName;
}

module.exports = resizer;