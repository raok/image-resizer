/**
 * Created by mario on 22/05/15.
 */

'use strict';
var _ = require("underscore");
var configs = require("./configs.json");
var _obj = {};

_obj.creator = function (path, sizesObj) {

    // returns array of size names
    var arrayOfSizes = _.map(sizesObj, function (index) {
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

