/**
 * Created by mario on 24/02/2015.
 */

'use strict';


//var _ = require("underscore");
//var async = require('async');
var argv = require("minimist")(process.argv.slice(2));
var request = require('request');

var getprotocol = require("./getProtocol");
var _getprotocol = getprotocol.getProtocol;

//var S3rs = require("./S3resizer");
//var s3resizer = S3rs.rs;

var objCr = require("./objectCreator");
var createObj = objCr.creator;

//var fileRs = require("./fileResizer");
//var fileResizer = fileRs.rs;

var configs = require("./config/configs.json");

//var mkDir = require("./makeDir");
//var makeDir = mkDir.handler;

var _resizer= require("./resizer");
var rs = _resizer.resize;

var _sqs = require("./sqsHandler");
var sqsSend = _sqs._sendMessage;

var copyFile = require('./copyFile');

var writeFile = require('./writeFile');



exports.lambdaHandler = function (event, context) {

    var sizesConfigs = configs.sizes;

    var _path = event.path;
    var _dir = event.dest;

    main(_path, _dir, sizesConfigs, function () {

        context.done();
    });
};

exports.cliHandler = function () {

    var sizesConfigs = configs.sizes;

    var _path = argv.source;
    var _dir = argv.dest;

    main(_path, _dir, sizesConfigs, function () {

        console.log("Resized for CLI");
        return;
    });
};

function getFile (src, callback) {

    copyFile.copy(src, function(sFile){
        callback(sFile);
    });
};

function resize (src, sizes, callback) {

    rs(src, sizes, function (dir) {
        callback(dir);
    });
};

function _write (srcDir, dest, callback) {
    writeFile._write (srcDir, dest, function (err) {
        callback();
    });
};

function main (src, dest, sizes, callback) {

    getFile(src, function (tmpFile) {
        resize(tmpFile, sizes, function (dir) {
            _write(dir, dest, function () {
                reqSender(src, callback);
            });
        });
    });
};

function httpReq (callback) {

    var reqUrl = configs.requestUrl;
    var reqBody = configs.eventMessage;

    var options = {
        method: 'POST',
        url: reqUrl,
        body: reqBody,
        json: true
    };

    request(options, function (error, response, body) {
        if( error ) {
            console.log(error);
            callback(error);
        }
        if ( !error && response.statusCode !== 200 ) {
            callback(new Error("No error, but status code %", response.statusCode));
        }

        if ( !error && response.statusCode === 200 ) {
            callback();
        }
    });
};

function reqSender (src, callback) {

    var _type = configs.reqType;

    switch(_type) {
        case "http":
            httpReq(function () {
                callback();
            });
            break;
        case "sqs":
            var obj = createObj(src);
            sqsSend(obj, function () {
                callback();
            });
            break;
        default :
            return console.log("No type for end request specified.");
    }
}

    // RegExp to check for image type
    //var imageTypeRegExp = /(?:(jpg)|(png)|(jpeg))$/;
//return;
//    // use configs file
//
//
//    var obj = createObj(src);
//
//    // Check if file has a supported image extension
//    var imgExt = imageTypeRegExp.exec(s3Key);
//
//    if (imgExt === null) {
//        if(!context) {
//            return console.error('Unable to infer the image type for key ' + s3Key);
//        } else if (context) {
//            context.done(new Error('unable to infer the image type for key ' + s3Key), null);
//        }
//    }
//
//    var imageType = imgExt[1] || imgExt[2];



if (!module.parent) {
    exports.cliHandler();
}

