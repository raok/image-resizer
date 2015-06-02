# ImageRs

## All code herein is property of hevnly.ltd

### This image processor resizes images from both the file system and S3 buckets.

### How to get it running on your local machine or VM (filesystem).

1 first note is you will need to have imagemagick installed on the environment you will be running the app.
To do this run `sudo apt-get install imagemagick`

2 next you will have to set-up the `aws cli` to send sqs messages to amazon's SQS.
Run the following commands or follow this [guideline](http://docs.aws.amazon.com/cli/latest/userguide/installing.html):
    + $ curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    + $ unzip awscli-bundle.zip
    + $ ./awscli-bundle/install -b ~/bin/aws
Once you have `aws cli` installed you will need to set it up. If you don't have an ID and secret access key, [get one](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html).
If you already have an ID and secret key, follow [this](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

3 __If you only want to run the app on your local machine__, jump to step 7.

4 next we need the image resizer app on our vagrant box. For this you will need to do a `git clone git@bitbucket.org:hevnly/image-resizer.git` in your develop branch of hevnly.dev.

5 we will also need to get `eevy`. `wget https://github.com/hevnly/eevy/releases/download/0.1.1/eevy` also in your develop branch.

6 in your vagrant box, cd into `/var/www/hevnly.dev` and change you `conf.yml` file so it looks like this:

```javascript
sources:
  - type: http
    port: 8000
listeners:
  api.image_created:
    - type: cli
      bin: node /vagrant/image-resizer/index.js
      args:
        - ${message}
        - ${message}
```

7 next its time to run the app. To do this:
    + in the command line type `node /path/to/app/index.js file:///source/path/to/target/image.png /destination/path/for/resized/images/`
    + note that the destination path ends with `/`
    + if the destination folder does not exist, the app will generate it for you before resizing the images.

### How to get it running on AWS Lambda

1 Change the following properties of the parameters.yml file:
    + imageStoreAdapter: to hevnlys3
    + and image_bucket to the bucket you want to use
    
2 Make sure you have a `lambda` function uploaded to lambda with the same name as the function defined in your `conf.yml` file.
    
3 Change you conf.yml file again to look like this:
    ```javascript
    sources:
      - type: http
        port: 8000
    listeners:
      api.image_created:
        - type: lambda
          region: eu-west-1
          function: Imager
          message: ${message}
    ```
    
4 Go into the directory where you have `eevy` installed. This should be `/var/www/hevnly.dev` and run `./eevy`.

5 Go to `hevnly.dev/discover` and post an image.
 
6 Go to your `s3bucket` and check if the images and been resized. They should be.