var http = require("http");
var querystring = require("querystring");
var _ = require("underscore");

apiCaller = {};

apiCaller.token = null;

var server=http.createServer(function(req,res){});

server.listen(8080);

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
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        // error response
        response.on("error", function (error) {
            if ( !context ) {
                console.error("Something went wrong with the api response.");
                return;
            }
            context.done(new Error("Something went wrong with the api response."));
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {

            apiCaller.token = JSON.parse(str).access_token;

            callback(null, apiCaller.token);
            // we want to stop the request if token is not correct
            if ( !apiCaller.token || apiCaller.token === undefined || apiCaller.token === null ) {
                if ( !context ) {
                    console.error("Something went wrong with the token. Wrong token! Token: %s", apiCaller.token);
                    return;
                }
                console.error("Token: %s", apiCaller.token);
                context.done(new Error("Something went wrong with the token. Wrong token!"));
            }
            console.log(str);
            console.log(apiCaller.token);

        });
    };

    var request = http.request(options, _callback);

    request.on('error', function(e) {
        console.log('problem with request');
    });

    request.end();
};

apiCaller._post = function (imgId, sizesConfigs, context, config, token, callback) {

   // request to tell our api images were resized
    var post_options = {
        method: "POST",
        hostname: config.host,
        path: "/image/" + imgId + "/resized",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Accept': "application/json",
            'Authorization': "Bearer " + token
        }
    };

    var data = querystring.stringify(_.map(sizesConfigs, function (num) {return num.destinationPath}));

    var body = "";

    var post_callback = function(response) {

        response.on('data', function (chunk) {
            //console.log("body: " + chunk);
            body += chunk;
        });
        // error response
        response.on("error", function (error) {
            if ( !context ) {
                console.error("Something went wrong with the api, put request.");
                return;
            }
            context.done(new Error("Something went wrong with the api, put request."));
        });

        response.on("end", function () {
            callback(null, body);
        });
    };

    var request = http.request(post_options, post_callback);

    request.end(data, function () {
        if ( !context ) {
            return console.log("Done/Post request end!");
        }
        context.done();
    });
};

module.exports = apiCaller;