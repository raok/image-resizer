/**
 * Created by mario on 11/05/15.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');

var resizer = {};

resizer.resize = function (directory, sizesObj, imgName) {
    async.map(sizesObj, function (sizesObj, mapNext) {
        gm(imgName)
            .resize(sizesObj.width, sizesObj.height)
            .write(directory + "/" + sizesObj.name + "/" + imgName, function (err) {
                if (err) {
                    console.error("Error resizing image, %s", err.message);
                    mapNext(err);
                    return;
                }
            });
    });
};

module.exports = resizer;