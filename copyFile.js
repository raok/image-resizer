/**
 * Created by mario (https://github.com/hyprstack) on 29/06/15.
 */

/**
 * Function to copy files from source
 */

var getprotocol = require("./getProtocol");
var _getprotocol = getprotocol.getProtocol;
var fs = require('fs');
var S3 = require("./S3Handler");
var S3get = S3._get;
var crypto = require('crypto');

var tmp = require('tmp');

copy = function (src, cb) {

    // get parts of passed file path
    var parts = _getprotocol(src);
    var tmpFile = createTmpFile(src, parts);

    // get protocol
    var _protocol = parts.protocol;

    switch(_protocol) {
        case 's3:':
            copyS3File(src, tmpFile, function(){
                console.log(tmpFile);
                cb(tmpFile);
            });
            break;
        case 'file:':
            copyLocalFile(src, tmpFile, function(){
                console.log(tmpFile);
                cb(tmpFile);
            });
            break;
        default:
            return console.log("Nothing to read");
    }
};

module.exports = {
    copy: copy
};

function createTmpFile(src, parts) {

    var imgName = parts.pathname.split("/").pop();
    var tmpDir = tmp.dirSync(); //object
    var tmpDirName = tmpDir.name + "/"; //path to directory
    var tmpFileName = crypto.createHash('md5').update(src + Math.floor(Date.now() / 1000)).digest('hex');
    return tmpDirName + tmpFileName + '.' + imgName.split('.').pop();

}

function copyS3File(src, dest, cb) {

    S3get(src, function(data) {
        fs.writeFile(dest, data, function (err) {
            cb();
        })
    });
}

function copyLocalFile (src, dest, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(src);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(dest);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}