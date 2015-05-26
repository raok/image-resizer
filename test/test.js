require('blanket')({
    pattern: function (filename) {
        return !/node_modules/.test(filename);
    }
});

// in terminal, type the following command to get code coverage: mocha -R html-cov > coverage.html

var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var extend = require('lodash').extend;
var sinon = require('sinon');
chai.use(sinonChai);
var proxyquire = require('proxyquire');
var url = require('url');
var mockDir = require('mock-fs');



//describe('AwsHandler', function () {
//    var expect = chai.expect;
//    var sizesConfigs = [
//        { width: 800, size: 'large' },
//        { width: 500, size: 'medium' },
//        { width: 200, size: 'small' },
//        { width: 45, size: 'thumbnail'}
//    ];
//    var baseEvent = {
//        "Records": [
//            { "s3": {
//                "bucket": { "name": "testbucket" },
//                "object": { "key": null }
//            }
//            }
//        ]
//    };
//
//    describe('reject to process non recognised image file extensions', function () {
//        var event, gmSpy, getObjectSpy, putObjectSpy, contextDoneSpy, testedModule;
//
//        before(function () {
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "no-supported.gif";
//            gmSpy = sinon.spy();
//            getObjectSpy = sinon.spy();
//            putObjectSpy = sinon.spy();
//            contextDoneSpy = sinon.spy();
//            testedModule = getTestedModule(gmSpy, getObjectSpy, putObjectSpy);
//            testedModule.AwsHandler(event, { done: contextDoneSpy });
//        });
//
//        it('never call s3 getObject', function () {
//            expect(getObjectSpy).has.not.been.called;
//        });
//        it('never call graphics magick', function () {
//            expect(gmSpy).has.not.been.called;
//        });
//        it('never call s3 putObject', function () {
//            expect(putObjectSpy).has.not.been.called;
//        });
//        it('call context done with error', function () {
//            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(new Error());
//        });
//    });
//
//    describe('process the image when the it has jpg extension', function () {
//        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse;
//
//        before(function (done) {
//            fakeResponse = { Body: 'image content' };
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "image.jpg";
//
//            gmStubs = getGmStubs();
//            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
//            putObjectStub = sinon.stub().callsArgWith(1, null);
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub);
//            testedModule.AwsHandler(event, { done: function () {
//                contextDoneSpy.apply(null, arguments);
//                done();
//            }});
//        });
//
//        it('call s3 getObject', function () {
//            expect(getObjectStub).has.been.calledOnce;
//            expect(getObjectStub).has.been.calledWith({
//                Bucket: event.Records[0].s3.bucket.name,
//                Key: event.Records[0].s3.object.key
//            });
//        });
//
//        it('call graphics magick', function () {
//            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);
//
//            sizesConfigs.forEach(function(s) {
//                expect(gmStubs.resize).has.been.calledWith(s.width);
//                expect(gmStubs.toBuffer).has.been.calledWith('jpg');
//            });
//        });
//
//        it('call s3 putObject', function () {
//            expect(putObjectStub).has.been.callCount(sizesConfigs.length);
//
//            sizesConfigs.forEach(function(s) {
//                expect(putObjectStub).has.been.calledWith({
//                    Bucket: event.Records[0].s3.bucket.name,
//                    Key: s.size + '_' + event.Records[0].s3.object.key,
//                    Body: 'data',
//                    ContentType: 'image/jpg'
//                });
//            });
//        });
//
//        it('call context done with no error', function () {
//            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
//        });
//    });
//
//    describe('process the image when the it has jpge extension', function () {
//        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse;
//
//        before(function (done) {
//            fakeResponse = { Body: 'image content' };
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "image.jpge";
//
//            gmStubs = getGmStubs();
//            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
//            putObjectStub = sinon.stub().callsArgWith(1, null);
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub);
//            testedModule.AwsHandler(event, { done: function () {
//                contextDoneSpy.apply(null, arguments);
//                done();
//            }});
//        });
//
//        it('call s3 getObject', function () {
//            expect(getObjectStub).has.been.calledOnce;
//            expect(getObjectStub).has.been.calledWith({
//                Bucket: event.Records[0].s3.bucket.name,
//                Key: event.Records[0].s3.object.key
//            });
//        });
//
//        it('call graphics magick', function () {
//            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);
//
//            sizesConfigs.forEach(function(s) {
//                expect(gmStubs.resize).has.been.calledWith(s.width);
//                expect(gmStubs.toBuffer).has.been.calledWith('jpg');
//            });
//        });
//
//        it('call s3 putObject', function () {
//            expect(putObjectStub).has.been.callCount(sizesConfigs.length);
//
//            sizesConfigs.forEach(function(s) {
//                expect(putObjectStub).has.been.calledWith({
//                    Bucket: event.Records[0].s3.bucket.name,
//                    Key: s.size + '_' + event.Records[0].s3.object.key,
//                    Body: 'data',
//                    ContentType: 'image/jpg'
//                });
//            });
//        });
//
//        it('call context done with no error', function () {
//            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
//        });
//    });
//
//    describe('process the image when the it has png extension', function () {
//        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse;
//
//        before(function (done) {
//            fakeResponse = { Body: 'image content' };
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "image.png";
//
//            gmStubs = getGmStubs();
//            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
//            putObjectStub = sinon.stub().callsArgWith(1, null);
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub);
//            testedModule.AwsHandler(event, { done: function () {
//                contextDoneSpy.apply(null, arguments);
//                done();
//            }});
//        });
//
//        it('call s3 getObject', function () {
//            expect(getObjectStub).has.been.calledOnce;
//            expect(getObjectStub).has.been.calledWith({
//                Bucket: event.Records[0].s3.bucket.name,
//                Key: event.Records[0].s3.object.key
//            });
//        });
//
//        it('call graphics magick', function () {
//            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);
//
//            sizesConfigs.forEach(function(s) {
//                expect(gmStubs.resize).has.been.calledWith(s.width);
//                expect(gmStubs.toBuffer).has.been.calledWith('png');
//            });
//        });
//
//        it('call s3 putObject', function () {
//            expect(putObjectStub).has.been.callCount(sizesConfigs.length);
//
//            sizesConfigs.forEach(function(s) {
//                expect(putObjectStub).has.been.calledWith({
//                    Bucket: event.Records[0].s3.bucket.name,
//                    Key: s.size + '_' + event.Records[0].s3.object.key,
//                    Body: 'data',
//                    ContentType: 'image/png'
//                });
//            });
//        });
//
//        it('call context done with no error', function () {
//            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
//        });
//    });
//
//    describe('process the image but image magick fails', function () {
//        var event, gmStubs, getObjectStub, putObjectSpy, contextDoneSpy, testedModule, fakeResponse;
//
//        before(function (done) {
//            fakeResponse = { Body: 'image content' };
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "image.png";
//
//            var toBufferStub = sinon.stub().callsArgWith(1, new Error('Image resize failed'));
//            gmStubs = getGmStubs(toBufferStub);
//            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
//            putObjectSpy = sinon.spy();
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectSpy);
//            testedModule.AwsHandler(event, { done: function () {
//                contextDoneSpy.apply(null, arguments);
//                done();
//            }});
//        });
//
//        it('call s3 getObject', function () {
//            expect(getObjectStub).has.been.calledOnce;
//            expect(getObjectStub).has.been.calledWith({
//                Bucket: event.Records[0].s3.bucket.name,
//                Key: event.Records[0].s3.object.key
//            });
//        });
//
//        it('call graphics magick', function () {
//            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
//            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);
//
//            sizesConfigs.forEach(function(s) {
//                expect(gmStubs.resize).has.been.calledWith(s.width);
//                expect(gmStubs.toBuffer).has.been.calledWith('png');
//            });
//        });
//
//        it('never call s3 putObject', function () {
//            expect(putObjectSpy).has.been.not.called;
//        });
//
//        it('call context done with no error', function () {
//            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(new Error('Image resize failed'));
//        });
//    });
//});
//
//function getGmStubs(toBuffer) {
//    var toBuffer = toBuffer || sinon.stub().callsArgWith(1, null, 'data')
//    var resize = sinon.stub().returns({ toBuffer: toBuffer });
//    var gm = sinon.stub().returns({ resize: resize });
//
//    return {
//        gm: gm,
//        resize: resize,
//        toBuffer: toBuffer
//    };
//}
//
//function getTestedModule(gm, getObject, putObject) {
//    return proxyquire('../index.js', {
//        'gm': { subClass: function() { return gm; } },
//        'aws-sdk': {
//            "S3": function () {
//                return {
//                    getObject: getObject,
//                    putObject: putObject
//                };
//            }
//        }
//    });
//}







describe("getProtocol", function () {
    var testedModule, parseSpy, _url;


    before(function () {

        _url = "http://www.some.com/test";

        parseSpy = sinon.spy(url, 'parse');

        testedModule = require('../getProtocol.js');
    });

    after(function () {
        url.parse.restore();
    });

    it("calls url.parse", function () {
        testedModule.getProtocol(_url);
        expect(parseSpy).has.been.calledOnce.and.calledWithExactly(_url, true);
    });
});



describe("resizer", function () {
    var testedModule, dir, sizesObj, imgName, writeSpy250, writeSpy350, writeSpy500, resizeStub, gmSubClassStub, fakeResponse;

    before(function () {

        dir = "/tmp/images";

        fakeResponse = {Body: "test.png"};

        sizesObj = [
            {name: "thumb", width: 250, height: 250},
            {name: "small", width: 350, height: 350},
            {name: "medium", width: 500, height: 500}
        ];

        imgName = "test.png";

        writeSpy250 = sinon.spy();
        writeSpy350 = sinon.spy();
        writeSpy500 = sinon.spy();

        resizeStub = sinon.stub();

        gmSubClassStub = sinon.stub();

        testedModule = proxyquire('../resizer.js', {
            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
        });

    });

    it("resize image and write to path", function () {

        resizeStub.withArgs(250, 250).returns({write:writeSpy250});
        resizeStub.withArgs(350, 350).returns({write:writeSpy350});
        resizeStub.withArgs(500, 500).returns({write:writeSpy500});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj);

        // Assert
        expect(writeSpy250).calledWith("/tmp/images/thumb_test.png");
        expect(writeSpy350).calledWith("/tmp/images/small_test.png");
        expect(writeSpy500).calledWith("/tmp/images/medium_test.png");
    });
});



describe("resizer with error", function () {
    var testedModule, dir, sizesObj, imgName, writeStub250, writeStub350, writeStub500, resizeStub, gmSubClassStub, fakeResponse;

    before(function () {

        dir = "/tmp/images";

        fakeResponse = {Body: "test.png"};

        sizesObj = [
            {width: 250, height: 250},
            {width: 350, height: 350},
            {width: 500, height: 500}
        ];

        imgName = "test.png";

        writeStub250 = sinon.stub();
        writeStub350 = sinon.stub();
        writeStub500 = sinon.stub();

        resizeStub = sinon.stub();

        gmSubClassStub = sinon.stub();

        testedModule = proxyquire('../resizer.js', {
            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
        });

    });

    it("resizes image and call error on write", function () {

        writeStub250.withArgs("/tmp/images/undefined_test.png").yields(new Error("Error resizing"));
        writeStub350.withArgs("/tmp/images/undefined_test.png").yields(new Error("Error resizing"));
        writeStub500.withArgs("/tmp/images/undefined_test.png").yields(new Error("Error resizing"));

        resizeStub.withArgs(250).returns({write:writeStub250});
        resizeStub.withArgs(350).returns({write:writeStub350});
        resizeStub.withArgs(500).returns({write:writeStub500});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj);

        // Assert
        expect(resizeStub).has.been.called;
        expect(writeStub250).contains(new Error("Error resizing"));
        expect(writeStub350).contains(new Error("Error resizing"));
        expect(writeStub500).contains(new Error("Error resizing"));
    });
});



describe("readDirectory _getFiles._get", function () {
    describe("_get success call", function () {
        var testedModule, callbackSpy, readFileStub;

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = require('../readDirectory.js');

            mockDir({
                tmp: {
                    images: {
                        "thumb_test.txt": "thumbnail pic",
                        "small_test.txt": "small pic",
                        "medium_test.txt": "medium pic"
                    }
                }
            });
        });

        after(function () {
            mockDir.restore();
        });

        it("returns list of files", function (done) {
            testedModule._get("tmp/images/", function (error, files) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.called.and.calledWith(null, ["medium_test.txt", "small_test.txt", "thumb_test.txt"]);
                done();
            });
        });
    });

    describe("_get error call", function () {
        var testedModule, callbackSpy, readFileStub;

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = proxyquire('../readDirectory.js', {
                "fs": {
                    "readdir": readFileStub
                }
            });

            mockDir({
                tmp: {
                    images: {
                        "thumb_test.txt": "thumbnail pic",
                        "small_test.txt": "small pic",
                        "medium_test.txt": "medium pic"
                    }
                }
            });

            readFileStub.callsArgWith(1, new Error("Error reading directory!"), null);
        });

        after(function () {
            mockDir.restore();
        });

        it("returns error", function () {
            testedModule._get("tmp/images/", function (error, files) {
                callbackSpy.apply(null, arguments);
            });
            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error reading directory!"), null);
        });
    });
});



describe("readDirectory _getFiles._getContent", function () {
    describe("_getContent success call", function () {
        var testedModule, callbackSpy, readFileStub;

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = require('../readDirectory.js');

            mockDir({
                "thumb_test.png": new Buffer([1,2,3])
            });
        });

        after(function () {
            mockDir.restore();
        });

        it("reads content of file", function (done) {
            testedModule._getContent("thumb_test.png", function (error, data) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.called.and.calledWith(null, new Buffer([1,2,3]));
                done();
            });

        });
    });

    describe("_getContent error call", function () {
        var testedModule, callbackSpy, readFileStub;

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = proxyquire('../readDirectory.js', {
                "fs": {
                    "readFile": readFileStub
                }
            });

            mockDir({
                "thumb_test.png": new Buffer([1,2,3])
            });

            readFileStub.callsArgWith(1, new Error("Error reading file!"), null);
        });

        after(function () {
            mockDir.restore();
        });

        it("returns error", function () {
            testedModule._getContent("thumb_test.png", function (error, data) {
                callbackSpy.apply(null, arguments);
            });
            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error reading file!"),null);
        });
    });
});



describe("S3Handler", function () {
    describe("S3Handler._get", function () {
        var testedModule, imgName, callbackSpy, bucketName, getStub, fakeResponse;

        before(function () {

            fakeResponse = {Body: "Image content"};

            imgName = "test.jpg";

            bucketName = "testBucket";

            callbackSpy = sinon.spy();

            getStub = sinon.stub();

            testedModule = proxyquire("../S3Handler.js", {
                'aws-sdk': {
                    "S3": function () {
                        return {
                            getObject: getStub
                        }
                    }
                }
            });
        });

        it("fetch object from S3Bucket", function () {
            getStub.callsArgWith(1, null, fakeResponse);
            testedModule._get(bucketName, imgName, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(null, fakeResponse);
        });

        it("fetch object from S3Bucket triggers error", function () {
            getStub.callsArgWith(1, new Error("Error fetching image!"), null);
            testedModule._get(bucketName, imgName, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error fetching image!"), null);
        });
    });

    describe("S3Handler._put", function () {
        var testedModule, imgName, imgType, content, data, bucketName, sizesObj, putStub, callbackSpy;

        before(function () {

            imgName = "test.png";

            imgType = "png";

            content = new Buffer([1,2,3]);

            bucketName = "testBucket";

            callbackSpy = sinon.spy();

            data = {
                "Expiration": "12-12-2016"
            };

            sizesObj = {
                width: 800, size: 'large'
            };

            putStub = sinon.stub();

            testedModule = proxyquire("../S3Handler.js", {
                'aws-sdk': {
                    "S3": function () {
                        return {
                            putObject: putStub
                        }
                    }
                }
            });
        });

        it("put object to S3Bucket", function () {
            putStub.callsArgWith(1, null, data);
            testedModule._put(bucketName, content, sizesObj, imgName, imgType, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(null, data);
        });

        it("put object triggers error", function () {
            putStub.callsArgWith(1, new Error("Error putting image to S3"), null);
            testedModule._put(bucketName, content, sizesObj, imgName, imgType, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error putting image to S3"));
        });
    });
});



describe("sqsHandler", function () {

    describe("sqsHandler._sendMessage success call", function () {
        var testedModule, callbackSpy, object, sqsStub;

        before(function () {

            callbackSpy = sinon.spy();

            sqsStub = sinon.stub();

            object = {
                "event": "image_rs.resizer",
                "message": {
                    "url": "blablabla",
                    "size": ["thumb", "small", "medium"]
                }
            };

            object = JSON.stringify(object);

            testedModule = proxyquire("../sqsHandler.js", {
                'aws-sdk': {
                    'SQS': function () {
                        return {
                            sendMessage: sqsStub
                        }
                    }
                }
            });
        });

        it("return response", function () {
            sqsStub.callsArgWith(1, null, "Sent");
            testedModule._sendMessage(object, function (error, data) {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(null, "Sent");
        });
    });

    describe("sqsHandler._sendMessage with error", function () {
        var testedModule, callbackSpy, sqsStub, object;

        before(function () {

            callbackSpy = sinon.spy();

            sqsStub = sinon.stub();

            object = {
                "event": "image_rs.resizer",
                "message": {
                    "url": "blablabla",
                    "size": ["thumb", "small", "medium"]
                }
            };

            object = JSON.stringify(object);

            testedModule = proxyquire("../sqsHandler.js", {
                'aws-sdk': {
                    'SQS': function () {
                        return {
                            sendMessage: sqsStub
                        }
                    }
                }
            });
        });

        it("triggers an error when sending message", function () {
            sqsStub.callsArgWith(1, new Error("Error sending message!"), null);
            testedModule._sendMessage(object, function (error, data) {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error sending message!"), null);
        });
    });
});



describe("objectCreator", function () {
    var testedModule, fakeObj, fakePath;

    before(function () {

        fakeObj = [
            { width: 800, height: 800, name: 'large' },
            { width: 500, height: 500, name: 'medium' },
            { width: 200, height: 200, name: 'small' },
            { width: 45, height: 45, name: 'thumbnail'}
        ];

        fakePath = "S3://bucketname/images/908798";

        testedModule = require("../objectCreator.js");
    });

    it("returns a newly formed object", function () {
        var result = testedModule.creator(fakePath, fakeObj);
        expect(result).to.be.ok;
        expect(result).contains("message");
        expect(result).contains("S3://bucketname/images/908798");
        expect(result).contains('{"event":"image_rs.re-sized","message":{"url":"S3://bucketname/images/908798","sizes":["large","medium","small","thumbnail"]}}');
    });
});



describe("S3resizer", function () {
    var testedModule, fakeResponse, fakeFiles, S3getStub, rsStub, readDirFileStub, readDirContStub, S3putStub, sqsCreateStub, sqsSendStub, cbSpy, imgName, bucketName, sizesObj, imageType, obj;

    before(function () {

        S3getStub = sinon.stub();

        rsStub = sinon.stub();

        readDirContStub = sinon.stub();

        readDirFileStub = sinon.stub();

        S3putStub = sinon.stub();

        sqsCreateStub = sinon.stub();

        sqsSendStub = sinon.stub();

        cbSpy = sinon.spy();

        imgName = "Whatever";

        bucketName = "Chappie";

        sizesObj = [
            { width: 800, height: 800, name: 'large' },
            { width: 500, height: 500, name: 'medium' },
            { width: 200, height: 200, name: 'small' },
            { width: 45, height: 45, name: 'thumbnail'}
        ];

        imageType = "png";

        obj = {
            "event":"image_rs.re-sized",
            "message": {
                "url":"S3://bucketname/images/908798",
                "sizes":["large","medium","small","thumbnail"]
            }
        };

        fakeResponse = { Body: 'image content' };

        fakeFiles = ["thumbnail_Whatever", "small_Whatever", "medium_Whatever", "large_Whatever"];

        testedModule = proxyquire ("../S3resizer.js", {
            "../S3Handler.js" : {
                _get: S3getStub,
                _put: S3putStub
            },
            "../readDirectory.js": {
                _get: readDirFileStub,
                _getContent: readDirContStub
            },
            "../resizer.js": {
                resize: rsStub
            },
            "../sqsHandler.js": {
                _createQueue: sqsCreateStub,
                _sendMessage: sqsSendStub
            }
        });
    });

    it("calls context.done", function (done) {
        S3getStub.callsArgWith(2, null, fakeResponse, imgName);
        readDirFileStub.callsArgWith(1, null, fakeFiles);

        testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
            cbSpy.apply(null, arguments);
            expect(cbSpy).has.been.called.and.calledWith("Done");
            done();
        });
    });
});