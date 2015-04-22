/**
 * Created by mario on 18/03/2015.
 */


{
    "Records": [
    {
        "eventVersion": "2.0",
        "eventSource": "aws:s3",
        "awsRegion": "eu-west-1",
        "eventTime": "1970-01-01T00:00:00.000Z",
        "eventName": "ObjectCreated:Put",
        "userIdentity": {
            "principalId": "AIDAJDPLRKLG7UEXAMPLE"
        },
        "requestParameters": {
            "sourceIPAddress": "127.0.0.1"
        },
        "responseElements": {
            "x-amz-request-id": "C3D13FE58DE4C810",
            "x-amz-id-2": "FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
        },
        "s3": {
            "s3SchemaVersion": "1.0",
            "configurationId": "testConfigRule",
            "bucket": {
                "name": "hevnlydevimageresize",
                "ownerIdentity": {
                    "principalId": "A3NL1KOZZKExample"
                },
                "arn": "arn:aws:s3:::hevnlydevimageresize"
            },
            "object": {
                "key": "bampw-cat-funny-kitty-lol-Favim.com-355986.jpg"
            }
        }
    }
]
}

apiCaller._post("f54c7690da7bf0", [{size: "large"}, {size: "medium"}, {size: "small"}, {size: "thumbnail"}], null, {
    "host": "hevnly.dev",
    "client_id": "1_3tk0nlxobfeoow0cw4w400k8o0g008ww00o44gookgskc8ggkw",
    "client_secret": "38nay3fseqkg0cw80kk4scookoookoskc0c84c4ckkgk4884k8",
    "grant_type": "client_credentials"
}, "YTBhYzM3OWNmYzg1ZGYyODg1ZjY0OTY1M2ExZmY1NzUyMTcwOGNjMGRjYWRhOTYwNzk5YTAwM2EzYWM2ZGE0MA", function (err,data) {console.log(data);});



