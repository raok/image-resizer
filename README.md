# ImageRs

## All code herein is property of hevnly.ltd

### This image processor resizes images from both the file system and S3 buckets.

### How to get it running on your local machine or VM (filesystem).

- first note is you will need to have imagemagick installed on the environment you will be running the app.
To do this run `sudo apt-get install imagemagick`

- next you will have to set-up the `aws cli` to send sqs messages to amazon's SQS.
Run the following commands or follow this [guideline](http://docs.aws.amazon.com/cli/latest/userguide/installing.html):
    + $ curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    + $ unzip awscli-bundle.zip
    + $ ./awscli-bundle/install -b ~/bin/aws
Once you have `aws cli` installed you will need to set it up. If you don't have an ID and secret access key, [get one](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html).
If you already have an ID and secret key, follow [this](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

- next its time to run the app. To do this:
    + in the command line type `node /path/to/app/index.js file:///source/path/to/target/image.png /destination/path/for/resized/images/`
    + note that the destination path ends with `/`
    + if the destination folder does not exist, the app will generate it for you before resizing the images.

### How to get it running on AWS Lambda