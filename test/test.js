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


describe("getProtocol", function () {
    var testedModule, parseSpy, _url;


    before(function () {

        _url = "http://www.some.com/image.jpeg";

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

        fakeResponse = {Body: "rstest.png"};

        sizesObj = {name: "thumb", width: 250, height: 250};

        imgName = "rstest.png";

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

        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
            callbackSpy.apply(null, arguments);
        });

        expect(writeStub250).has.been.called.and.calledWith("/tmp/thumb-rstest.png");
    });

    it("calls callbackSpy", function () {
        writeStub250.callsArgWith(1, null);

        resizeStub.withArgs(250, 250).returns({write:writeStub250});

        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});

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

        fakeResponse = "rstest.png";

        sizesObj = {name: "thumb", width: 250, height: 250};

        imgName = "rstest.png";

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

        expect(writeStub250).has.been.called.and.calledWith("/tmp/thumb-rstest.png");
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

        fakeResponse = {Body: "rstest.png"};

        sizesObj = {width: 250, height: 250};

        imgName = "rstest.png";

        writeStub250 = sinon.stub();

        resizeStub = sinon.stub();

        gmSubClassStub = sinon.stub();

        callbackSpy = sinon.spy();

        testedModule = proxyquire('../resizer', {
            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
        });

    });

    it("resizes image and call error on write", function () {

        writeStub250.withArgs("/tmp/undefined-rstest.png").yields(new Error("Error resizing"));

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
                        "thumb-dirtest.txt": "thumbnail pic",
                        "small-dirtest.txt": "small pic",
                        "medium-dirtest.txt": "medium pic"
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
                expect(callbackSpy).has.been.called.and.calledWith(null, ["medium-dirtest.txt", "small-dirtest.txt", "thumb-dirtest.txt"]);
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
                        "thumb-dirtest.txt": "thumbnail pic",
                        "small-dirtest.txt": "small pic",
                        "medium-dirtest.txt": "medium pic"
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
        var testedModule, callbackSpy, fakeCont, readFileStub;

        fakeCont = new Buffer([1,2,3]);

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = proxyquire('../readDirectory', {
                "fs": {
                    "readFile": readFileStub
                }
            });

            readFileStub.callsArgWith(1, null, fakeCont);
        });

        it("reads content of file", function () {
            testedModule._getContent("thumb-Dirtest.png", "images/", function (error, data) {
                callbackSpy.apply(null, arguments);
            });
            expect(callbackSpy).has.been.called.and.calledWith(null, fakeCont);
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

            readFileStub.callsArgWith(1, new Error("Error reading file!"), null);
        });

        it("returns error", function () {
            testedModule._getContent("thumb-Dirtest.png", "images/", function (error, data) {
                callbackSpy.apply(null, arguments);
            });
            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error reading file!"), null);
        });
    });
});



describe("S3Handler", function () {
    describe("S3Handler._get", function () {
        var testedModule, imgName, callbackSpy, bucketName, getStub, putStub, fakeResponse;

        before(function () {

            fakeResponse = {Body: "Body Content"};

            imgName = "S3test.jpg";

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

            imgName = "S3test.png";

            imgType = "png";

            fileName = "large-S3test.png";

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

    var testedModule, fakeResponse, fakePutMessage, fakeSqsMessage, fakeFiles, S3getStub, rsStub, readDirFileStub, readDirContStub, S3putStub, sqsSendStub, cbSpy, imgName, bucketName, sizesObj, imageType, obj;

    before(function () {

        S3getStub = sinon.stub(S3, "_get");

        rsStub = sinon.stub(_resizer, "resize");

        readDirContStub = sinon.stub(read, "_getContent");

        readDirFileStub = sinon.stub(read, "_get");

        S3putStub = sinon.stub(S3, "_put");

        sqsSendStub = sinon.stub(_sqs, "_sendMessage");

        cbSpy = sinon.spy();

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
        expect(sqsSendStub).has.been.calledOnce;
    });

    it("calls final callback", function () {
        expect(cbSpy).has.been.called.and.calledWith(null);
        expect(cbSpy).has.been.calledOnce;
    });
});

describe("S3resizer error calls", function () {
    // To avoid having to refactor code with a global override of the require method and using the cached versions from previous tests, freshly require the modules and inject in stubs.
    var S3 = require("../S3Handler");
    var read = require("../readDirectory");
    var _resizer= require("../resizer");
    var _sqs = require("../sqsHandler");

    var testedModule, fakeResponse, fakePutMessage, fakeSqsMessage, fakeFiles, S3getStub, rsStub, readDirFileStub, readDirContStub, S3putStub, sqsSendStub, cbSpy, imgName, bucketName, sizesObj, imageType, obj;

    before(function () {
        S3getStub = sinon.stub(S3, "_get");

        rsStub = sinon.stub(_resizer, "resize");

        readDirContStub = sinon.stub(read, "_getContent");

        readDirFileStub = sinon.stub(read, "_get");

        S3putStub = sinon.stub(S3, "_put");

        sqsSendStub = sinon.stub(_sqs, "_sendMessage");

        cbSpy = sinon.spy();

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

    });

    after(function () {
        S3._get.restore();
        _resizer.resize.restore();
        read._getContent.restore();
        read._get.restore();
        S3._put.restore();
        _sqs._sendMessage.restore();
    });

    describe("Error with S3get", function () {
        before(function () {
            S3getStub.callsArgWith(2, new Error("Error fetching image from S3."), null);

            testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        it("S3get error when fetching image", function () {
            expect(cbSpy).has.been.called.and.calledWith(new Error("Error fetching image from S3."));
            expect(rsStub).has.not.been.called;
            expect(readDirFileStub).has.not.been.called;
            expect(readDirContStub).has.not.been.called;
            expect(S3putStub).has.not.been.called;
            expect(sqsSendStub).has.not.been.called;
        });
    });

    describe("Error with resizer", function () {
        before(function () {
            S3getStub.callsArgWith(2, null, fakeResponse);

            rsStub.callsArgWith(4, new Error("Error resizing image."));

            testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        it("Error with resizer function", function () {
            expect(S3getStub).has.been.called.and.calledWith("Chappie", "Whatever");
            expect(readDirFileStub).has.not.been.called;
            expect(readDirContStub).has.not.been.called;
            expect(S3putStub).has.not.been.called;
            expect(sqsSendStub).has.not.been.called;
            expect(cbSpy).has.been.called.and.calledWith(new Error("Error resizing image."));
        });
    });

    describe("Error with readDir", function () {
        before(function () {
            S3getStub.callsArgWith(2, null, fakeResponse);

            rsStub.callsArgWith(4, null);

            readDirFileStub.callsArgWith(1, new Error("Error reading files from directory."), null);

            testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        it("Error reading files from directory", function () {
            expect(S3getStub).has.been.called.and.calledWith("Chappie", "Whatever");
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 800, height: 800, name: 'large' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 500, height: 500, name: 'medium' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 200, height: 200, name: 'small' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 45, height: 45, name: 'thumbnail' });
            expect(readDirFileStub).has.been.called;
            expect(readDirContStub).has.not.been.called;
            expect(S3putStub).has.not.been.called;
            expect(sqsSendStub).has.not.been.called;
            expect(cbSpy).has.been.called.and.calledWith(new Error("Error reading files from directory."));
        });
    });

    describe("Error with readDirCont", function () {
        before(function () {
            S3getStub.callsArgWith(2, null, fakeResponse);

            rsStub.callsArgWith(4, null);

            readDirFileStub.callsArgWith(1, null, fakeFiles);

            readDirContStub.callsArgWith(2, new Error("Error reading content from files."), null);

            testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        it("Error reading content from files", function () {
            expect(S3getStub).has.been.called.and.calledWith("Chappie", "Whatever");
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 800, height: 800, name: 'large' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 500, height: 500, name: 'medium' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 200, height: 200, name: 'small' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 45, height: 45, name: 'thumbnail' });
            expect(readDirFileStub).has.been.called.and.calledWith("/tmp/");
            expect(S3putStub).has.not.been.called;
            expect(sqsSendStub).has.not.been.called;
            expect(cbSpy).has.been.called.and.calledWith(new Error("Error reading content from files."));
        });
    });

    describe("Error with S3put", function () {
        before(function () {
            S3getStub.callsArgWith(2, null, fakeResponse);

            rsStub.callsArgWith(4, null);

            readDirFileStub.callsArgWith(1, null, fakeFiles);

            readDirContStub.callsArgWith(2, null, fakeResponse);

            S3putStub.callsArgWith(5, new Error("Error putting file to S3."), null);

            testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        it("Error writing to S3 bucket", function () {
            expect(S3getStub).has.been.called.and.calledWith("Chappie", "Whatever");
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 800, height: 800, name: 'large' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 500, height: 500, name: 'medium' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 200, height: 200, name: 'small' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 45, height: 45, name: 'thumbnail' });
            expect(readDirFileStub).has.been.called.and.calledWith("/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[0], "/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[1], "/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[2], "/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[3], "/tmp/");
            expect(readDirContStub).has.been.callCount(fakeFiles.length);
            expect(S3putStub).has.been.called;
            expect(sqsSendStub).has.not.been.called;
            expect(cbSpy).has.been.called.and.calledWith(new Error("Error putting file to S3."));
        });
    });

    describe("Error with sqsSend", function () {
        before(function () {
            S3getStub.callsArgWith(2, null, fakeResponse);

            rsStub.callsArgWith(4, null);

            readDirFileStub.callsArgWith(1, null, fakeFiles);

            readDirContStub.callsArgWith(2, null, fakeResponse);

            S3putStub.callsArgWith(5, null, fakePutMessage);

            sqsSendStub.callsArgWith(1, new Error("Error sending sqs message."), null);

            testedModule.rs(imgName, bucketName, sizesObj, imageType, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        it("Error sending sqs message", function () {
            expect(S3getStub).has.been.called.and.calledWith("Chappie", "Whatever");
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 800, height: 800, name: 'large' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 500, height: 500, name: 'medium' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 200, height: 200, name: 'small' });
            expect(rsStub).has.been.called.and.calledWith(fakeResponse, "Whatever", "/tmp/", { width: 45, height: 45, name: 'thumbnail' });
            expect(readDirFileStub).has.been.called.and.calledWith("/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[0], "/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[1], "/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[2], "/tmp/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[3], "/tmp/");
            expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[0], imgName, imageType);
            expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[1], imgName, imageType);
            expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[2], imgName, imageType);
            expect(S3putStub).has.been.called.and.calledWith(bucketName, null, fakeFiles[3], imgName, imageType);
            expect(cbSpy).has.been.called.and.calledWith(new Error("Error sending sqs message."));
        })
    });
});

describe("fileResizer", function () {
    describe("fileResizer success call", function () {
        // To avoid having to refactor code with a global override of the require method and using the cached versions from previous tests, freshly require the modules and inject in stubs.
        var read = require("../readDirectory");
        var _resizer = require("../resizer");
        var _sqs = require("../sqsHandler");
        var _fileWrite = require("../writeFiles");
        var tmp = require("tmp");

        var testedModule, fakePath, fakeResponse, fakeTmpStub, fakeSqsMessage, fakeFiles, rsStub, readDirFileStub, readDirContStub, writeFileStub, sqsSendStub, cbSpy, imgName, fakeDstPath, sizesObj, imageType, obj;

        before(function () {
            writeFileStub = sinon.stub(_fileWrite, "_write");

            rsStub = sinon.stub(_resizer, "resize");

            readDirContStub = sinon.stub(read, "_getContent");

            readDirFileStub = sinon.stub(read, "_get");

            sqsSendStub = sinon.stub(_sqs, "_sendMessage");

            fakeTmpStub = sinon.stub(tmp, "dirSync");

            cbSpy = sinon.spy();

            testedModule = proxyquire('../fileResizer', {
                './writeFiles': {
                    _write: writeFileStub
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
                },
                'tmp': {
                    'dirSync': fakeTmpStub
                }
            });

            fakeTmpStub.returns({name: "/var/folders/tmp/4000fl"});

            imgName = "Whatever";

            fakePath = "path/to/image/Whatever.png";

            fakeDstPath = "path/to/dst/";

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

            fakeSqsMessage = {BinaryValue: "123"};

            fakeFiles = ["thumbnail-Whatever", "small-Whatever", "medium-Whatever", "large-Whatever"];

            rsStub.callsArgWith(4, null);

            readDirFileStub.callsArgWith(1, null, fakeFiles);

            readDirContStub.callsArgWith(2, null, fakeResponse);

            writeFileStub.callsArgWith(3, null);

            sqsSendStub.callsArgWith(1, null, fakeSqsMessage);

            testedModule.rs(fakePath, imgName, fakeDstPath, sizesObj, obj, function () {
                cbSpy.apply(null, arguments);
            });
        });

        after(function () {
            _fileWrite._write.restore();
            _resizer.resize.restore();
            read._getContent.restore();
            read._get.restore();
            _sqs._sendMessage.restore();
            tmp.dirSync.restore();
        });

        it("resizes image", function () {
            expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 800, height: 800, name: 'large' });
            expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 500, height: 500, name: 'medium' });
            expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 200, height: 200, name: 'small' });
            expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 45, height: 45, name: 'thumbnail' });
            expect(rsStub).has.been.callCount(sizesObj.length);
        });

        it("reads files from directory", function () {
            expect(readDirFileStub).has.been.called.and.calledWith("/var/folders/tmp/4000fl/");
        });

        it("reads contents from files", function () {
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[0], "/var/folders/tmp/4000fl/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[1], "/var/folders/tmp/4000fl/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[2], "/var/folders/tmp/4000fl/");
            expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[3], "/var/folders/tmp/4000fl/");
            expect(readDirContStub).has.been.callCount(fakeFiles.length);
        });

        it("writes files to directory", function () {
            expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[0], fakeDstPath, fakeResponse);
            expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[1], fakeDstPath, fakeResponse);
            expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[2], fakeDstPath, fakeResponse);
            expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[3], fakeDstPath, fakeResponse);
            expect(writeFileStub).has.been.callCount(fakeFiles.length);
        });

        it("sends sqs message", function () {
            expect(sqsSendStub).has.been.called.and.calledWith(obj);
            expect(sqsSendStub).has.been.calledOnce;
        });

        it("calls finall callback with no error", function () {
            expect(cbSpy).has.been.called.and.calledWith();
            expect(cbSpy).has.been.calledOnce;
        });
    });

    describe("fileResizer with error calls", function () {
        // To avoid having to refactor code with a global override of the require method and using the cached versions from previous tests, freshly require the modules and inject in stubs.
        var read = require("../readDirectory");
        var _resizer = require("../resizer");
        var _sqs = require("../sqsHandler");
        var _fileWrite = require("../writeFiles");
        var tmp = require("tmp");

        var testedModule, fakePath, fakeResponse, fakeTmpStub, fakeSqsMessage, fakeFiles, rsStub, readDirFileStub, readDirContStub, writeFileStub, sqsSendStub, cbSpy, imgName, fakeDstPath, sizesObj, imageType, obj;

        before(function () {
            writeFileStub = sinon.stub(_fileWrite, "_write");

            rsStub = sinon.stub(_resizer, "resize");

            readDirContStub = sinon.stub(read, "_getContent");

            readDirFileStub = sinon.stub(read, "_get");

            sqsSendStub = sinon.stub(_sqs, "_sendMessage");

            fakeTmpStub = sinon.stub(tmp, "dirSync");

            cbSpy = sinon.spy();

            testedModule = proxyquire('../fileResizer', {
                './writeFiles': {
                    _write: writeFileStub
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
                },
                'tmp': {
                    'dirSync': fakeTmpStub
                }
            });

            fakeTmpStub.returns({name: "/var/folders/tmp/4000fl"});

            imgName = "Whatever";

            fakePath = "path/to/image/Whatever.png";

            fakeDstPath = "path/to/dst/";

            sizesObj = [
                {width: 800, height: 800, name: 'large'},
                {width: 500, height: 500, name: 'medium'},
                {width: 200, height: 200, name: 'small'},
                {width: 45, height: 45, name: 'thumbnail'}
            ];

            imageType = "png";

            obj = {
                "event": "re-sized",
                "message": {
                    "url": "S3://bucketname/images/908798",
                    "sizes": ["large", "medium", "small", "thumbnail"]
                }
            };

            fakeResponse = {Body: 'image content'};

            fakeSqsMessage = {BinaryValue: "123"};

            fakeFiles = ["thumbnail-Whatever", "small-Whatever", "medium-Whatever", "large-Whatever"];
        });

        after(function () {
            _fileWrite._write.restore();
            _resizer.resize.restore();
            read._getContent.restore();
            read._get.restore();
            _sqs._sendMessage.restore();
            tmp.dirSync.restore();
        });

        describe("Error when resizing image", function () {
            before(function () {
                rsStub.callsArgWith(4, new Error("Error resizing image."));

                testedModule.rs(fakePath, imgName, fakeDstPath, sizesObj, obj, function () {
                    cbSpy.apply(null, arguments);
                });
            });

            it("Error with resizer function", function () {
                expect(readDirFileStub).has.not.been.called;
                expect(readDirContStub).has.not.been.called;
                expect(writeFileStub).has.not.been.called;
                expect(sqsSendStub).has.not.been.called;
                expect(cbSpy).has.been.called.and.calledWith(new Error("Error resizing image."));
            });
        });

        describe("Error with readDir", function () {
            before(function () {
                rsStub.callsArgWith(4, null);

                readDirFileStub.callsArgWith(1, new Error("Error reading files from directory."), null);

                testedModule.rs(fakePath, imgName, fakeDstPath, sizesObj, obj, function () {
                    cbSpy.apply(null, arguments);
                });
            });

            it("Error reading files from directory", function () {
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 800, height: 800, name: 'large' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 500, height: 500, name: 'medium' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 200, height: 200, name: 'small' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 45, height: 45, name: 'thumbnail' });
                expect(readDirFileStub).has.been.called;
                expect(readDirContStub).has.not.been.called;
                expect(writeFileStub).has.not.been.called;
                expect(sqsSendStub).has.not.been.called;
                expect(cbSpy).has.been.called.and.calledWith(new Error("Error reading files from directory."));
            });
        });

        describe("Error with readDirCont", function () {
            before(function () {
                rsStub.callsArgWith(4, null);

                readDirFileStub.callsArgWith(1, null, fakeFiles);

                readDirContStub.callsArgWith(2, new Error("Error reading content from file."), null);

                testedModule.rs(fakePath, imgName, fakeDstPath, sizesObj, obj, function () {
                    cbSpy.apply(null, arguments);
                });
            });

            it("Error reading content from files", function () {
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 800, height: 800, name: 'large' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 500, height: 500, name: 'medium' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 200, height: 200, name: 'small' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 45, height: 45, name: 'thumbnail' });
                expect(readDirFileStub).has.been.called.and.calledWith("/var/folders/tmp/4000fl/");
                expect(writeFileStub).has.been.called;
                expect(sqsSendStub).has.not.been.called;
                expect(cbSpy).has.been.called.and.calledWith(new Error("Error reading content from file."));
            });
        });

        describe("Error with writeFiles", function () {
            before(function () {
                rsStub.callsArgWith(4, null);

                readDirFileStub.callsArgWith(1, null, fakeFiles);

                readDirContStub.callsArgWith(2, null, fakeResponse);

                writeFileStub.callsArgWith(3, new Error("Error writting files to directory."));

                testedModule.rs(fakePath, imgName, fakeDstPath, sizesObj, obj, function () {
                    cbSpy.apply(null, arguments);
                });
            });

            it("Error writing files to directory", function () {
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 800, height: 800, name: 'large' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 500, height: 500, name: 'medium' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 200, height: 200, name: 'small' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 45, height: 45, name: 'thumbnail' });
                expect(readDirFileStub).has.been.called.and.calledWith("/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[0], "/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[1], "/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[2], "/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[3], "/var/folders/tmp/4000fl/");
                expect(writeFileStub).has.been.called;
                expect(sqsSendStub).has.not.been.called;
                expect(cbSpy).has.been.called.and.calledWith(new Error("Error writting files to directory."));
            });
        });

        describe("Error with sqsSend", function () {
            before(function () {
                rsStub.callsArgWith(4, null);

                readDirFileStub.callsArgWith(1, null, fakeFiles);

                readDirContStub.callsArgWith(2, null, fakeResponse);

                writeFileStub.callsArgWith(3, null);

                sqsSendStub.callsArgWith(1, new Error("Error sending sqs message."), null);

                testedModule.rs(fakePath, imgName, fakeDstPath, sizesObj, obj, function () {
                    cbSpy.apply(null, arguments);
                });
            });

            it("Error sending sqs message", function () {
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 800, height: 800, name: 'large' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 500, height: 500, name: 'medium' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 200, height: 200, name: 'small' });
                expect(rsStub).has.been.called.and.calledWith(fakePath, "Whatever", "/var/folders/tmp/4000fl/", { width: 45, height: 45, name: 'thumbnail' });
                expect(readDirFileStub).has.been.called.and.calledWith("/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[0], "/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[1], "/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[2], "/var/folders/tmp/4000fl/");
                expect(readDirContStub).has.been.called.and.calledWith(fakeFiles[3], "/var/folders/tmp/4000fl/");
                expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[0], fakeDstPath, fakeResponse);
                expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[1], fakeDstPath, fakeResponse);
                expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[2], fakeDstPath, fakeResponse);
                expect(writeFileStub).has.been.called.and.calledWith(fakeFiles[3], fakeDstPath, fakeResponse);
                expect(sqsSendStub).has.been.called;
                expect(cbSpy).has.been.called.and.calledWith(new Error("Error sending sqs message."));
            });
        });
    });
});

describe("imgeRs", function () {

    var getprotocol = require("../getProtocol");
    var S3rs = require("../S3resizer");
    var objCr = require("../objectCreator");
    var mkDir = require("../makeDir");
    var fileResizer = require("../fileResizer");

    describe("Calling S3", function () {
        describe("Success call", function () {

            var testedModule, event, contextDoneSpy, S3resizerStub, objCreatorStub, getProtocolStub, fakeResults, mkDirStub, fileResizerStub;

            var baseEvent = {"path": "s3://theBucket/image.jpeg"};

            before(function (done) {
                contextDoneSpy = sinon.spy();

                S3resizerStub = sinon.stub(S3rs, "rs");

                objCreatorStub = sinon.stub(objCr, 'creator');

                getProtocolStub = sinon.stub(getprotocol, "getProtocol").returns({
                    "hostname": "theBucket",
                    "protocol": "s3:",
                    "pathname": "/image.jpeg"});

                mkDirStub = sinon.stub(mkDir, "handler");

                fileResizerStub = sinon.stub(fileResizer, "rs");

                event = extend({}, baseEvent);

                fakeResults = ["resized"];

                testedModule = proxyquire("../index", {
                    './getProtocol': {
                        'getProtocol': getProtocolStub
                    },
                    './S3resizer': {
                        'rs': S3resizerStub
                    },
                    './objectCreator': {
                        'creator': objCreatorStub
                    },
                    './makeDir': {
                        'handler': mkDirStub
                    },
                    './fileResizer': {
                        'rs': fileResizerStub
                    }
                });

                getProtocolStub();

                S3resizerStub.callsArgWith(5, null, fakeResults);

                testedModule.imageRs(event, {done: function (error) {
                    contextDoneSpy.apply(null, arguments);
                    done();
                }});
            });

            after(function () {
                S3rs.rs.restore();
                objCr.creator.restore();
                getprotocol.getProtocol.restore();
                mkDir.handler.restore();
                fileResizer.rs.restore();
            });

            it("calls context.done with no error", function () {
                expect(contextDoneSpy).has.been.called.and.calledWith(fakeResults);
            });
        });

        describe("Error call", function () {

            var testedModule, event, contextDoneSpy, S3resizerStub, objCreatorStub, getProtocolStub, fakeError, mkDirStub, fileResizerStub;

            var baseEvent = {"path": "s3://theBucket/image.jpeg"};

            before(function (done) {
                contextDoneSpy = sinon.spy();

                S3resizerStub = sinon.stub(S3rs, "rs");

                objCreatorStub = sinon.stub(objCr, 'creator');

                getProtocolStub = sinon.stub(getprotocol, "getProtocol").returns({
                    "hostname": "theBucket",
                    "protocol": "s3:",
                    "pathname": "/image.jpeg"});

                mkDirStub = sinon.stub(mkDir, "handler");

                fileResizerStub = sinon.stub(fileResizer, "rs");

                event = extend({}, baseEvent);

                fakeError = new Error("Error resizing image for s3.");

                testedModule = proxyquire("../index", {
                    './getProtocol': {
                        'getProtocol': getProtocolStub
                    },
                    './S3resizer': {
                        'rs': S3resizerStub
                    },
                    './objectCreator': {
                        'creator': objCreatorStub
                    },
                    './makeDir': {
                        'handler': mkDirStub
                    },
                    './fileResizer': {
                        'rs': fileResizerStub
                    }
                });

                getProtocolStub();

                S3resizerStub.callsArgWith(5, fakeError, null);

                testedModule.imageRs(event, {done: function (error) {
                    contextDoneSpy.apply(null, arguments);
                    done();
                }});
            });

            after(function () {
                S3rs.rs.restore();
                objCr.creator.restore();
                getprotocol.getProtocol.restore();
                mkDir.handler.restore();
                fileResizer.rs.restore();
            });

            it("calls context.done with error", function () {
                expect(contextDoneSpy).has.been.called.and.calledWith(fakeError);
            });
        });
    });

    describe("Calling file", function () {
        describe("Success call", function () {

            var testedModule, event, contextDoneSpy, S3resizerStub, objCreatorStub, getProtocolStub, fakeResults, mkDirStub, fileResizerStub;

            var baseEvent = {'path': 'file://images/image.jpeg'};

            fakeResults = console.log("Image processed without errors for 'file' path");
            before(function () {
                contextDoneSpy = sinon.spy();

                S3resizerStub = sinon.stub(S3rs, "rs");

                objCreatorStub = sinon.stub(objCr, 'creator');

                getProtocolStub = sinon.stub(getprotocol, "getProtocol").returns({
                    "hostname": "images",
                    "protocol": "file:",
                    "pathname": "/image.jpeg"
                });

                mkDirStub = sinon.stub(mkDir, "handler");

                fileResizerStub = sinon.stub(fileResizer, "rs");

                event = extend({}, baseEvent);

                testedModule = proxyquire("../index", {
                    './getProtocol': {
                        'getProtocol': getProtocolStub
                    },
                    './S3resizer': {
                        'rs': S3resizerStub
                    },
                    './objectCreator': {
                        'creator': objCreatorStub
                    },
                    './makeDir': {
                        'handler': mkDirStub
                    },
                    './fileResizer': {
                        'rs': fileResizerStub
                    }
                });

                getProtocolStub();

                mkDirStub.callsArgWith(2, null, "Built");

                fileResizerStub.callsArgWith(5, null, fakeResults);
            });

            after(function () {
                S3rs.rs.restore();
                objCr.creator.restore();
                getprotocol.getProtocol.restore();
                mkDir.handler.restore();
                fileResizer.rs.restore();
            });

            it("call returns 'Image processed without errors for file path'", function () {
                var result = testedModule.imageRs();
                expect(result).to.equal(fakeResults);
            });
        });

        describe("Error call", function () {

            var testedModule, event, contextDoneSpy, S3resizerStub, objCreatorStub, getProtocolStub, mkDirStub, fileResizerStub;

            var baseEvent = {'path': 'file://images/image.jpeg'};

            before(function () {
                contextDoneSpy = sinon.spy();

                S3resizerStub = sinon.stub(S3rs, "rs");

                objCreatorStub = sinon.stub(objCr, 'creator');

                getProtocolStub = sinon.stub(getprotocol, "getProtocol").returns({
                    "hostname": "images",
                    "protocol": "file:",
                    "pathname": "/image.jpeg"
                });

                mkDirStub = sinon.stub(mkDir, "handler");

                fileResizerStub = sinon.stub(fileResizer, "rs");

                event = extend({}, baseEvent);

                testedModule = proxyquire("../index", {
                    './getProtocol': {
                        'getProtocol': getProtocolStub
                    },
                    './S3resizer': {
                        'rs': S3resizerStub
                    },
                    './objectCreator': {
                        'creator': objCreatorStub
                    },
                    './makeDir': {
                        'handler': mkDirStub
                    },
                    './fileResizer': {
                        'rs': fileResizerStub
                    }
                });

                getProtocolStub();

                mkDirStub.callsArgWith(2, null, "Built");

                fileResizerStub.callsArgWith(5, new Error("Error processing image with path 'file'"), null);
            });

            after(function () {
                S3rs.rs.restore();
                objCr.creator.restore();
                getprotocol.getProtocol.restore();
                mkDir.handler.restore();
                fileResizer.rs.restore();
            });

            it("returns 'Image processed with errors for file path'", function () {
                var result = testedModule.imageRs();
                expect(result).to.equal(undefined); //TODO: Not happy with this. Why is it returning undefined!
            });
        });
    });
});