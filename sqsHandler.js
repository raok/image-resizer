/**
 * Created by mario on 21/05/15.
 */

/**
 * @param obj - type string
 * @param obj - will contain an 'event' property and a 'message' property with 'url' property and 'size' array with names of sizes
 * @param callback in createQueue - will be method _sendMessage
 * @param callback in sendMessage - will be context.done() for Lambda environment
 */

'use strict';

var AWS = require('aws-sdk');
var sqs = new AWS.SQS({apiVersion: 'latest', region: 'eu-west-1'});

var configs = require("./configs.json");

var sqsHandler = {};

var _queueName = configs.queueName;

var queryUrl = null;


sqsHandler._createQueue = function (callback) {

    var params = {
        QueueName: _queueName
    };


    sqs.createQueue(params, function (error, data) {
        if( error ) {
            callback(error, null);
        } else {
            queryUrl = data.QueueUrl;
            callback(null, data);
        }
    });
};

sqsHandler._sendMessage = function (obj, callback) {

    var params = {
        MessageBody : obj,
        QueueUrl: queryUrl
    };

    sqs.sendMessage(params, function (error, data) {
        if ( error ) {
            callback(error, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = sqsHandler;