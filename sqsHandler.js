/**
 * Created by mario (https://github.com/hyprstack) on 21/05/15.
 */

/**
 * This function takes a created object and sends it to an existent sqs queue with url '_queueURL' as a sqs message.
 * @var configs - type json object, contains the url for the sqs queue
 * @param obj type object - will contain an 'event' property and a 'message' property with 'url' property and 'size' array with names of sizes
 * @param callback in sendMessage - will take two parameters. Error and data; data will be an object containing MessageBody, MessageAttributes and MessageId
 */

'use strict';

var AWS = require('aws-sdk');
var sqs = new AWS.SQS({apiVersion: 'latest', region: 'eu-west-1'});

var configs = require("./config/configs.json");

var sqsHandler = {};

var _queueUrl = configs.queueUrl;

sqsHandler._sendMessage = function (obj, callback) {

    var params = {
        MessageBody: obj,
        QueueUrl: _queueUrl
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
