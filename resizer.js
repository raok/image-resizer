/**
 * Created by mario on 11/05/15.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });

var resizer = {};

resizer.resize = function (data, imgName, directory, sizesObj, callback) {

    if (data.hasOwnProperty('Body')) {
        data = data.Body;
    } else {
        data = data;
    }

    gm(data)
        .resize(sizesObj.width, sizesObj.height)
        .write(directory + sizesObj.name + "_" + imgName, function (err) {
            if (err) {
                console.error("Error resizing image, %s", err.message);
                callback(err);
                return;
            }
            console.log("Wrote to '%s' directory, with size name '%s' and image name '%s'", directory, sizesObj.name, imgName);
            callback();
        });

};

module.exports = resizer;