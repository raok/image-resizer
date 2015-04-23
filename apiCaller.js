'use strict'

var http = require("http");
var querystring = require("querystring");
var qs = require("qs");
var _ = require("underscore");
var _environ = require("./dev_configs.json").environment;

var apiCaller = {};

apiCaller.token = null;

// TODO: Server needs to be wrapped in a if statement which must listen on the config file to determine the environment.
// Lambda does not require the http server and does not run if one if provided.

if (_environ === "develop" || _environ === "nightly") {

    var server = http.createServer(function (req, res) {
    });

    server.listen(8080);
}

apiCaller._get = function (context, config, callback) {

    // get the parameters for our querytring
    var oauthParams = _.pick(config, "client_id", "client_secret", "grant_type");

    // create the querystring
    var params = querystring.stringify(oauthParams);

    var options = {
        method: "GET",
        hostname: config.host,
        path: "/oauth/v2/token?" + params,
        headers : {
            'Content-Type': "application/json",
            'Accept': "application/json"
        }
    };

    var _callback = function(response) {

        console.log('GET STATUS: ' + response.statusCode);

        var str = '';

        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        // error response
        response.on("error", function (error) {
            if ( !context ) {
                console.error("Something went wrong with the api response.");
                callback(error);
                return;
            }
            context.done(new Error("Something went wrong with the api response."));
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {

            apiCaller.token = JSON.parse(str).access_token;

            // we want to stop the request if token is not correct
            if ( !apiCaller.token || apiCaller.token === undefined || apiCaller.token === null ) {
                if ( !context ) {
                    console.error("Something went wrong with the token. Wrong token! Token: %s", apiCaller.token);
                    return;
                }
                console.error("Token: %s", apiCaller.token);
                context.done(new Error("Something went wrong with the token. Wrong token!"));
            }
            callback(null, apiCaller.token);

        });
    };

    var request = http.request(options, _callback);

    request.on('error', function(e) {
        console.log('problem with request');
    });

    request.end();
};

apiCaller._post = function (imgId, sizesConfigs, context, config, callback) {

   // options for request
    var post_options = {
        method: "POST",
        hostname: config.host,
        path: "/image/" + imgId + "/resized",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Accept': "application/json",
            'Authorization': "Bearer " + apiCaller.token
        }
    };

    // create array of only sizes
    var ArrOfSizes = _.map(sizesConfigs, function (num) {
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

    var body = "";

    var post_callback = function(response) {

        console.log('STATUS POST: ' + response.statusCode);

        response.on('data', function (chunk) {
            console.log("Body" + chunk);
            body += chunk;
        });

        // error response
        response.on("error", function (error) {
            if ( !context ) {
                console.error("Something went wrong with the api, post request.");
                callback(error);
                return
            }
            context.done(new Error("Something went wrong with the api, post request."));
        });

        response.on("end", function () {
            if ( !context ) {
                console.log("Done!")
                return callback(null, body);
            }
        });
    };

    var request = http.request(post_options, post_callback);

    request.end(data, function () {
        if ( !context ) {
            console.log("Post request end!");
        }
    });
};

module.exports = apiCaller;