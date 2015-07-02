/**
 * Created by mario (https://github.com/hyprstack) on 24/02/2015.
 *
 * @fn createObj - function used to create our object to send in the sqs queue
 * @fn rs - function that takes care of the actual resizing
 * @fn sqsSend - function that send the sqs queue message
 * @fn copyFile - function that copies files to a temporary directory to then be manipulated by the rs function
 * @fn writeFile - function that writes the file from the temporary directory to a target destination
 * @fn lambdaHandler - module used on lambda environment to resize images
 * @fn cliHandler - module used for the command line to resize images
 *
 * @param configs - our configurations files, where we define the target sizes, sqs queue url, type of request, request url and request body
 */

'use strict';

var argv = require("minimist")(process.argv.slice(2));
var request = require('request');

var objCr = require("./lib/modules/objectCreator");
var createObj = objCr.creator;

var configs = require("./config/configs.json");

var _resizer= require("./lib/modules/resizer");
var rs = _resizer.resize;

var _sqs = require("./lib/modules/sqsHandler");
var sqsSend = _sqs._sendMessage;

var copyFile = require('./lib/modules/copyFile');

var writeFile = require('./lib/modules/writeFile');



exports.lambdaHandler = function (event, context) {

    var sizesConfigs = configs.sizes;

    var _path = event.path;
    var _dir = event.dest;

    imgExtChecker(_path, context);

    main(_path, _dir, sizesConfigs, function (error) {

        if ( error ) {
            context.done(error);
        } else {
            context.done(null);
        }
    });
};

exports.cliHandler = function () {

    var sizesConfigs = configs.sizes;

    var _path = argv.source;
    var _dir = argv.dest;

    imgExtChecker(_path, null);

    main(_path, _dir, sizesConfigs, function (error) {

        if ( error ) {
            return console.log("Error with CLI resizer.");
        } else {
            return console.log("Resized for CLI");
        }
    });
};

// Check the type of file is an image
function imgExtChecker (src, context) {

    var imgName = src.split("/").pop();
    var imageTypeRegExp = /(?:(jpg)|(png)|(jpeg))$/;
    var imgExt = imageTypeRegExp.exec(imgName);

    if (imgExt === null) {
        if(context === null) {
            throw new Error("Unable to infer the image type.");
        } else if (context) {
            context.done(new Error('unable to infer the image type for key ' + imgName), null);
        }
    }
}

// Retrieve the file
function getFile (src, callback) {

    copyFile.copy(src, function(sFile){
        callback(sFile);
    });
};


// Do actual resizing of image
function resize (src, sizes, callback) {

    rs(src, sizes, function (dir) {
        callback(dir);
    });
};


// Write file to destination
function _write (srcDir, dest, callback) {
    writeFile._write (srcDir, dest, function (err) {
        callback();
    });
};

// This is our main caller function
function main (src, dest, sizes, callback) {

    getFile(src, function (tmpFile) {
        resize(tmpFile, sizes, function (dir) {
            _write(dir, dest, function () {
                reqSender(src, callback);
            });
        });
    });
};


// Send an http request
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

// Function that determines if we send an http request or a sqs queue message
function reqSender (src, callback) {

    var _type = configs.reqType;

    switch(_type) {
        case "http":
            // send http request
            httpReq(function () {
                callback();
            });
            break;
        case "sqs":
            // create our object for the sqs queue message
            var obj = createObj(src);
            // send the sqs queue message
            sqsSend(obj, function () {
                callback();
            });
            break;
        default :
            return console.log("No type for end request specified.");
    }
}

if (!module.parent) {
    exports.cliHandler();
}

