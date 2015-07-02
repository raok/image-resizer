/**
 * Created by mario (https://github.com/hyprstack) on 22/05/15.
 */

/**
 * @creator - this function creates an object which will be sent to aws sqs queue and part of the message.
 * @params path type string - path of file being manipulated.
 * @var arrayOfSizes - an array containing the size names to which the image was manipulated.
 * @var obj - an object containing the event name, the path of the image being resized and an array of sizes to which the image was manipulated. This will be the body of the sqs message.
 */

'use strict';
var _ = require("underscore");
var configs = require("./../../config/configs.json");
var _obj = {};

_obj.creator = function (path) {

    // returns array of size names
    var arrayOfSizes = _.map(configs.sizes, function (index) {
        return index.name;
    });

    var obj = {
        "event": configs.eventName,
        "message": {
            "url": path,
            "sizes": arrayOfSizes
        }
    };

    obj = JSON.stringify(obj);

    return obj;
};

module.exports = _obj;

