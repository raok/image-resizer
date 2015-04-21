var http = require("http");
var querystring = require("querystring");
var _ = require("underscore");

apiCaller = {};

apiCaller.token = null;

// hostName should be a string

var server=http.createServer(function(req,res){
});

server.listen(8080);

apiCaller._get = function (context, config, fn) {

    // request to obtain our oauth token
    var options = {
        method: "GET",
        hostname: config.host,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "client_credentials",
        path: "/oauth/v2/token",
        headers : {
            'Content-Type': "application/json",
            'Accept': "application/json"
        }
    };

    var callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        // error response
        response.on("error", function (error) {
            if ( !context ) {
                console.error("Something went wrong with the api, get request");
                return;
            }
            context.done(new Error("Something went wrong with the api, get request"));
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

        });
    };

    var request = http.request(options, callback);

    request.on('error', function(e) {
        console.log('problem with request:');
    });
    request.end();
}

apiCaller._post = function (imgId, sizesConfigs, context, config, fn) {

   // request to tell our api images were resized
    var post_options = {
        method: "POST",
        host: config.host,
        path: "/img/" + imgId + "/resized",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Accept': "application/x-www-form-urlencoded",
            'Header key': 'Authorization',
            'Header value': 'Bearer ' + apiCaller.token
        }
    };

    var data = querystring.stringify(_.map(sizesConfigs, function (num) {return num.destinationPath}));

    var post_callback = function(response) {

        response.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
        // error response
        response.on("error", function (error) {
            if ( !context ) {
                console.error("Something went wrong with the api, put request.");
                return;
            }
            context.done(new Error("Something went wrong with the api, put request."));
        });
    };

    var request = http.request(post_options, post_callback);

    request.end(data, function () {
        console.log('Post request successful!');
        if ( !context ) {
            fn();
        }
        context.done();
    });
}

module.exports = apiCaller;