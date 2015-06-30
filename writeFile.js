/**
 * Created by mario (https://github.com/hyprstack) on 30/06/15.
 */

/**
 * Function to write files to destination
 */


var getprotocol = require("./getProtocol");
var _getprotocol = getprotocol.getProtocol;
var S3 = require("./S3Handler");
var S3put = S3._put;
var ncp = require('ncp');

_write = function (source, dest, cb) {

    // @param source is directory from which we want to write the files

    var parts = _getprotocol(dest);
    console.log(parts);
    // get protocol
    var _protocol = parts.protocol;

    switch(_protocol) {
        case "s3:":
            writeS3File (parts, function () {
                cb();
            });
            break;
        case "file:":
            writeLocalFile (source, dest, function () {
                cb();
            });
            break;
        default:
            return console.log("Nothing to write");
    }
};

module.exports = {
    _write: _write
};

function writeLocalFile (srcDir, dest, callback) {

    var parts = _getprotocol(dest);
    dest = parts. pathname;

    ncp(srcDir, dest, function (err) {
        if (err) {
            callback(err);
        } else {
            callback("Done!");
        }
    });
};

function writeS3File () {

};