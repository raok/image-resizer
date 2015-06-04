"use strict";

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
var proxyquire = require('proxyquire').noCallThru();
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



describe("resizer when data has property 'Body'", function () {
    var testedModule, dir, sizesObj, imgName, writeStub250, callbackSpy, resizeStub, gmSubClassStub, fakeResponse;

    before(function () {

        dir = "/tmp/";

        fakeResponse = {Body: "test.png"};

        sizesObj = {name: "thumb", width: 250, height: 250};

        imgName = "test.png";

        writeStub250 = sinon.stub();

        resizeStub = sinon.stub();

        gmSubClassStub = sinon.stub();

        callbackSpy = sinon.spy();

        testedModule = proxyquire('../resizer', {
            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
        });

    });

    it("resize image and write to path", function () {

        resizeStub.withArgs(250, 250).returns({write:writeStub250});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
            callbackSpy.apply(null, arguments);
        });

        expect(writeStub250).has.been.called.and.calledWith("/tmp/thumb-test.png");
    });

    it("calls callbackSpy", function () {
        writeStub250.callsArgWith(1, null);

        resizeStub.withArgs(250, 250).returns({write:writeStub250});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
            callbackSpy.apply(null, arguments);
        });

        expect(callbackSpy).has.been.called;
    });
});

describe("resizer when data is path", function () {
    var testedModule, dir, sizesObj, imgName, writeStub250, callbackSpy, resizeStub, gmSubClassStub, fakeResponse;

    before(function () {

        dir = "/tmp/";

        fakeResponse = "test.png";

        sizesObj = {name: "thumb", width: 250, height: 250};

        imgName = "test.png";

        writeStub250 = sinon.stub();

        resizeStub = sinon.stub();

        gmSubClassStub = sinon.stub();

        callbackSpy = sinon.spy();

        testedModule = proxyquire('../resizer', {
            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
        });

    });

    it("resize image and write to path", function () {

        resizeStub.withArgs(250, 250).returns({write:writeStub250});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
            callbackSpy.apply(null, arguments);
        });

        expect(writeStub250).has.been.called.and.calledWith("/tmp/thumb-test.png");
    });

    it("calls callbackSpy", function () {
        writeStub250.callsArgWith(1, null);

        resizeStub.withArgs(250, 250).returns({write:writeStub250});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
            callbackSpy.apply(null, arguments);
        });

        expect(callbackSpy).has.been.called;
    });
});



describe("resizer with error", function () {
    var testedModule, dir, sizesObj, imgName, writeStub250, callbackSpy, resizeStub, gmSubClassStub, fakeResponse;

    before(function () {

        dir = "/tmp/";

        fakeResponse = {Body: "test.png"};

        sizesObj = {width: 250, height: 250};

        imgName = "test.png";

        writeStub250 = sinon.stub();

        resizeStub = sinon.stub();

        gmSubClassStub = sinon.stub();

        callbackSpy = sinon.spy();

        testedModule = proxyquire('../resizer', {
            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
        });

    });

    it("resizes image and call error on write", function () {

        writeStub250.withArgs("/tmp/undefined-test.png").yields(new Error("Error resizing"));

        resizeStub.withArgs(250).returns({write:writeStub250});

        // Stub is used when you just want to simulate a returned value
        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
            callbackSpy.apply(null, arguments);
        });

        // Assert
        expect(resizeStub).has.been.called;
        expect(writeStub250).contains(new Error("Error resizing"));
        expect(callbackSpy).has.been.called.and.calledWith(new Error("Error resizing"));
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
                        "thumb-test.txt": "thumbnail pic",
                        "small-test.txt": "small pic",
                        "medium-test.txt": "medium pic"
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
                expect(callbackSpy).has.been.called.and.calledWith(null, ["medium-test.txt", "small-test.txt", "thumb-test.txt"]);
                done();
            });
        });
    });

    describe("_get error call", function () {
        var testedModule, callbackSpy, readFileStub;

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = proxyquire('../readDirectory', {
                "fs": {
                    "readdir": readFileStub
                }
            });

            mockDir({
                tmp: {
                    images: {
                        "thumb-test.txt": "thumbnail pic",
                        "small-test.txt": "small pic",
                        "medium-test.txt": "medium pic"
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
                "images" : {
                    "thumb-test.png": new Buffer([1,2,3])
                }
            });
        });

        after(function () {
            mockDir.restore();
        });

        it("reads content of file", function (done) {
            testedModule._getContent("thumb-test.png", "images/", function (error, data) {
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

            testedModule = proxyquire('../readDirectory', {
                "fs": {
                    "readFile": readFileStub
                }
            });

            mockDir({
                "images" : {
                    "thumb_test.png": new Buffer([1,2,3])
                }
            });

            readFileStub.callsArgWith(1, new Error("Error reading file!"), null);
        });

        after(function () {
            mockDir.restore();
        });

        it("returns error", function () {
            testedModule._getContent("thumb-test.png", "images/", function (error, data) {
                callbackSpy.apply(null, arguments);
            });
            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error reading file!"),null);
        });
    });
});



describe("S3Handler", function () {
    describe("S3Handler._get", function () {
        var testedModule, imgName, callbackSpy, bucketName, getStub, putStub, fakeResponse;

        before(function () {

            fakeResponse = {Body: "Body Content"};

            imgName = "test.jpg";

            bucketName = "testBucket";

            callbackSpy = sinon.spy();

            getStub = sinon.stub();

            putStub = sinon.stub();

            testedModule = proxyquire("../S3Handler", {
                'aws-sdk': {
                    "S3": function () {
                        return {
                            getObject: getStub,
                            putObject: putStub
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
        var testedModule, imgName, imgType, content, data, bucketName, getStub, putStub, callbackSpy, fileName;

        before(function () {

            imgName = "test.png";

            imgType = "png";

            fileName = "large-test.png";

            content = new Buffer([1,2,3]);

            bucketName = "testBucket";

            callbackSpy = sinon.spy();

            data = {
                "Expiration": "12-12-2016"
            };

            putStub = sinon.stub();

            getStub = sinon.stub();

            testedModule = proxyquire("../S3Handler", {
                'aws-sdk': {
                    "S3": function () {
                        return {
                            getObject: getStub,
                            putObject: putStub
                        }
                    }
                }
            });
        });

        it("put object to S3Bucket", function () {
            putStub.callsArgWith(1, null, data);
            testedModule._put(bucketName, content, fileName, imgName, imgType, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(null, data);
        });

        it("put object triggers error", function () {
            putStub.callsArgWith(1, new Error("Error putting image to S3"), null);
            testedModule._put(bucketName, content, fileName, imgName, imgType, function () {
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

            testedModule = proxyquire("../sqsHandler", {
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

            testedModule = proxyquire("../sqsHandler", {
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

describe("makeDir", function () {
    describe("creates directory", function () {
        var testedModule, fakeObj, fakePath, callbackSpy;

        before(function () {
            fakeObj = { width: 800, height: 800, name: 'large' };

            fakePath = "documents/"

            callbackSpy = sinon.spy();

            testedModule = require("../makeDir.js");

            mockDir({
                "documents" : {}
            });
        });

        after(function () {
            mockDir.restore();
        });

        it('create new directory', function (done) {
            testedModule.handler(fakePath, fakeObj, function (err, made) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.calledOnce.and.calledWith(null, made);
                done();
            });
        });
    });

    describe("directory already exists", function () {
        var testedModule, fakeObj, fakePath, callbackSpy;

        before(function () {
            fakeObj = { width: 800, height: 800, name: 'large' };

            fakePath = "documents/"

            callbackSpy = sinon.spy();

            testedModule = require("../makeDir.js");

            mockDir({
                "documents" : {
                    "large": { }
                }
            });
        });

        after(function () {
            mockDir.restore();
        });

        it("calls callback with null", function (done) {
            testedModule.handler(fakePath, fakeObj, function (err, stats) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.calledOnce.and.calledWithExactly(null);
                done();
            });
        });
    });

    describe("calls callback with error when creating directory", function () {
        var testedModule, fakeObj, fakePath, callbackSpy, fsStub, mkdirpStub;

        before(function () {
            fakeObj = { width: 800, height: 800, name: 'large' };

            fakePath = new Buffer([1,2,3]);

            callbackSpy = sinon.spy();

            fsStub = sinon.stub();

            mkdirpStub = sinon.stub();

            testedModule = proxyquire('../makeDir', {
                fs: {
                    lstat: fsStub
                },
                mkdirp: mkdirpStub
            });

        });

        it("triggers error when creating a new directory", function (done) {

            mkdirpStub.callsArgWith(1, new Error("Error creating directory"), null);

            fsStub.callsArgWith(1, new Error("Error"), null);

            testedModule.handler(fakePath, fakeObj, function (err, made) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.called.and.calledWithExactly(new Error("Error creating directory"), null);
                done();
            });

        });
    });
});

describe("writeFiles", function () {

    describe("writes file to directory", function () {
        var testedModule, callbackSpy, fileName, dstFolder, data;

        before(function () {
            callbackSpy = sinon.spy();

            fileName = "large-diavel.png";

            dstFolder = "images/";

            data = new Buffer([1,2,3]);

            testedModule = require("../writeFiles.js");

            mockDir({
                "images" : {
                    "large": { }
                }
            });

        });

        after(function ()  {
            mockDir.restore();
        });

        it("writes files to directory", function (done) {
            testedModule._write(fileName, dstFolder, data, function(err) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.called.and.calledWithExactly();
                done();
            });
        });
    });

    describe("calls callback with error when writing file", function () {
        var testedModule, callbackSpy, fileName, dstFolder, data, fsStub;

        before(function () {
            callbackSpy = sinon.spy();

            fileName = "large-diavel.png";

            dstFolder = "images/";
            data = new Buffer([1,2,3]);

            fsStub = sinon.stub();

            testedModule = proxyquire('../writeFiles', {
                fs: {
                    writeFile: fsStub
                }
            });

        });

        it("calls callback with error", function (done) {

            fsStub.callsArgWith(2, new Error("Error writing to directory."));

            testedModule._write(fileName, dstFolder, data, function(err) {
                callbackSpy.apply(null, arguments);
                expect(callbackSpy).has.been.called.and.calledWith(new Error("Error writing to directory."), null);
                done();
            });
        });
    });
});


describe("S3resizer succesfull call", function () {

    // To avoid having to refactor code with a global override of the require method and using the cached versions from previous tests, freshly require the modules and inject in stubs.
    var S3 = require("../S3Handler");
    var read = require("../readDirectory");
    var _resizer= require("../resizer");
    var _sqs = require("../sqsHandler");

    var testedModule, fakeResponse, fakePutMessage, fakeSqsMessage, fakeFiles, S3getStub, rsStub, readDirFileStub, readDirContStub, S3putStub, sqsSendStub, cbSpy, callbSpy, imgName, bucketName, sizesObj, imageType, obj;

    before(function () {

        S3getStub = sinon.stub(S3, "_get");

        rsStub = sinon.stub(_resizer, "resize");

        readDirContStub = sinon.stub(read, "_getContent");

        readDirFileStub = sinon.stub(read, "_get");

        S3putStub = sinon.stub(S3, "_put");

        sqsSendStub = sinon.stub(_sqs, "_sendMessage");

        cbSpy = sinon.spy();

        callbSpy = sinon.spy();

        testedModule = proxyquire('../S3resizer', {
            './S3Handler': {
                _get: S3getStub,
                _put: S3putStub
            },
            './readDirectory': {
                _get: readDirFileStub,
                _getContent: readDirContStub
            },
            './resizer': {
                resize: rsStub
            },
            './sqsHandler': {
                _sendMessage: sqsSendStub
            }
        });

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
            "event":"re-sized",
            "message": {
                "url":"S3://bucketname/images/908798",
                "sizes":["large","medium","small","thumbnail"]
            }
        };

        fakeResponse = {Body: 'image content'};

        fakePutMessage = {messageId: "1223abc"};

        fakeSqsMessage = {BinaryValue: "123"};

        fakeFiles = ["thumbnail-Whatever", "small-Whatever", "medium-Whatever", "large-Whatever"];

        S3getStub.callsArgWith(2, null, fakeResponse);

        rsStub.callsArgWith(4, null);

        readDirFileStub.callsArgWith(1, null, fakeFiles);

        readDirContStub.callsArgWith(2, null, fakeResponse);

        S3putStub.callsArgWith(5, null, fakePutMessage);

        sqsSendStub.callsArgWith(1, null, fakeSqsMessage);

        testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
            cbSpy.apply(null, arguments);
        });
    });

    after(function () {
        S3._get.restore();
        _resizer.resize.restore();
        read._getContent.restore();
        read._get.restore();
        S3._put.restore();
        _sqs._sendMessage.restore();
    });

    it("fetches image from S3 and resizes to sizesObject sizes", function () {
        expect(S3getStub).has.been.called.and.calledWith("Chappie", "Whatever");
        expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 800, height: 800, name: 'large' });
        expect(rsStub).has.been.callCount(sizesObj.length);
    });

    it("reads files names from directory", function () {
        expect(readDirFileStub).has.been.called.and.calledWith("/tmp/");
    });

    it("reads content from files", function() {
        expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[0], "/tmp/");
        expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[1], "/tmp/");
        expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[2], "/tmp/");
        expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[3], "/tmp/");
        expect(readDirContStub).has.been.callCount(fakeFiles.length);
    });

    it("puts object to S3", function () {
        expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[0], imgName, imageType);
        expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[1], imgName, imageType);
        expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[2], imgName, imageType);
        expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[3], imgName, imageType);
        expect(S3putStub).has.been.callCount(fakeFiles.length);
    });

    it("sends sqs message", function () {
        expect(sqsSendStub).has.been.called.and.calledWith(obj);
    });

    it("calls final callback", function () {
        expect(cbSpy).has.been.called.and.calledWith(null);
        expect(sqsSendStub).has.been.calledOnce;
    });
});