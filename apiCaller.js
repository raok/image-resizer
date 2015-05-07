'use strict'

var http = require("http");
var querystring = require("querystring");
var qs = require("qs");
var _ = require("underscore");
var _environ = require("./configs.json").environment;
var request = require("request");

var apiCaller = {};

apiCaller.token = null;

// Lambda does not require the http server and does not run if one if provided.

if (_environ === "develop" || _environ === "nightly") {

    var server = http.createServer(function (req, res) {
    });

    server.listen(8080);
    console.log("Server running");
}

apiCaller._get = function (event, context, callback) {

    // get the parameters for our querytring
    var oauthParams = _.pick(event, "client_id", "client_secret", "grant_type");

    // create the querystring
    var params = querystring.stringify(oauthParams);

    var get_options = {
        uri: event.host + "/oauth/v2/token?" + params,
        headers : {
            'Content-Type': "application/json",
            'Accept': "application/json"
        }
    };

    request.get(get_options, function (error, response, body) {
            if (error) {
                if ( !context ) {
                    console.error("Something went wrong with the api response: %s", error);
                    callback(error);
                    return;
                }
                context.done(new Error("Something went wrong with the api response."));
            }

            if (!error && response.statusCode === 200) {

                if(typeof body === "string") {
                    body = JSON.parse(body);
                }

                apiCaller.token = body.access_token;

                // we want to stop the request if token is not correct
                if ( !apiCaller.token ) {
                    if ( !context ) {
                        console.error("Something went wrong with the token. Wrong token! Token: %s", apiCaller.token);
                        return;
                    }
                    console.error("Token: %s", apiCaller.token);
                    context.done(new Error("Something went wrong with the token. Wrong token!"));
                }
                callback(null, apiCaller.token);
            }
    });
};

apiCaller._post = function (event, imgId, sizesevents, context, callback) {

    // create array of only sizes
    var ArrOfSizes = _.map(sizesevents, function (num) {
        return num.size;
    });

    var dataObj = {};

    // transform array into object
    var obj = ArrOfSizes.reduce(function(o, v, i) {
        o[i] = v;
        return o;
    }, {});
    // create property "sizes" and assign value "obj"
    dataObj.sizes = obj;

    var data = qs.stringify(dataObj);

    // options for request
    var post_options = {
        uri: event.host + "/image/" + imgId + "/resized",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Accept': "application/json",
            'Authorization': "Bearer " + apiCaller.token
        },
        qs : data
    };

    request.post(post_options, function (error, response, body) {
            if (error) {
                if ( !context ) {
                    console.log(body);
                    console.log(response);
                    console.error("Something went wrong with the api, post request: %s", error);
                    callback(error);
                    return
                }
                context.done(new Error("Something went wrong with the api, post request."));
            }
            console.log(response);
            console.log(body);
            if ( !context ) {
                console.log("Done!")
                return callback(null, body);
            }

    });
};

module.exports = apiCaller;