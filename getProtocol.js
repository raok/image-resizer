/**
 * Created by mario on 11/05/15.
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