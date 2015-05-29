/**
 * Created by mario on 11/05/15.
 */

'use strict';

// dependencies
var gm = require('gm').subClass({ imageMagick: true });

var resizer = {};

resizer.resize = function (data, imgName, directory, sizesObj, callback) {

    var _data = null;

    if (data.hasOwnProperty("Body")) {
        _data = data.Body;
    } else {
        _data = data;
    }

    console.log(_data);

    gm(_data)
        .resize(sizesObj.width, sizesObj.height)
        .write(directory + sizesObj.name + "-" + imgName, function (err) {
            if (err) {
                console.log("There was an error while resizing the image: %s", err);
                callback(err);
                return;
            }
            console.log("Wrote to '%s' directory, with size name '%s' and image name '%s'", directory, sizesObj.name, imgName);
            callback();
        });

};

module.exports = resizer;