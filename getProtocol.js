/**
 * Created by mario on 11/05/15.
 */

/**
 * @getProtocol - this function returns the parts of a passed url. This function is used to determine the protocol of the passed URL.
 * @params path type string - the full path containing the files to be manipulated.
 */

'use strict';

var url = require("url");

var proto = {};

proto.getProtocol = function (path) {
    var parts;

    parts = url.parse(path, true);
    return parts;
};

module.exports = proto;