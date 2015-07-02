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

        testedModule = require('../lib/modules/getProtocol.js');
    });

    after(function () {
        url.parse.restore();
    });

    it("calls url.parse", function () {
        testedModule.getProtocol(_url);
        expect(parseSpy).has.been.calledOnce.and.calledWithExactly(_url, true);
    });
});



//describe("resizer when data is path", function () {
//    var testedModule, dir, sizesObj, tmpStub, writeStub250, writeStub500, writeStub650, writeStub750, callbackSpy, resizeStub, gmSubClassStub;
//
//    before(function () {
//
//        dir = "/tmp/rstest.png";
//
//        sizesObj = [
//            {name: "thumb", width: 250, height: 250},
//            {name: "small", width: 500, height: 500},
//            {name: "medium", width: 650, height: 650},
//            {name: "large", width: 750, height: 750}
//        ];
//
//
//        writeStub250 = sinon.stub();
//        writeStub500 = sinon.stub();
//        writeStub650 = sinon.stub();
//        writeStub750 = sinon.stub();
//
//        resizeStub = sinon.stub();
//
//        tmpStub = sinon.stub().returns("/temporary/");
//
//        gmSubClassStub = sinon.stub();
//
//        callbackSpy = sinon.spy();
//
//        testedModule = proxyquire('../resizer', {
//            'gm': {subClass: sinon.stub().returns(gmSubClassStub)},
//            'tmp': {
//                dirSync: {
//                    name: tmpStub
//                }
//            }
//        });
//
//    });
//
//    it("resize image and write to path", function () {
//
//        resizeStub.withArgs(250, 250).returns({write:writeStub250});
//        resizeStub.withArgs(500, 500).returns({write:writeStub500});
//        resizeStub.withArgs(650, 650).returns({write:writeStub650});
//        resizeStub.withArgs(750, 750).returns({write:writeStub750});
//
//        // Stub is used when you just want to simulate a returned value
//        gmSubClassStub.withArgs(dir).returns({resize:resizeStub});
//
//        // Act - this calls the tested method
//        testedModule.resize(dir, sizesObj, function (err) {
//            callbackSpy.apply(null, arguments);
//        });
//
//        expect(writeStub250).has.been.called.and.calledWith("/temporary/thumb.png");
//    });
//
//    it("calls callbackSpy", function () {
//
//        writeStub250.callsArgWith(1, null);
//        writeStub500.callsArgWith(1, null);
//        writeStub650.callsArgWith(1, null);
//        writeStub750.callsArgWith(1, null);
//
//        resizeStub.withArgs(250, 250).returns({write:writeStub250});
//        resizeStub.withArgs(500, 500).returns({write:writeStub500});
//        resizeStub.withArgs(650, 650).returns({write:writeStub650});
//        resizeStub.withArgs(750, 750).returns({write:writeStub750});
//
//        // Stub is used when you just want to simulate a returned value
//        gmSubClassStub.withArgs(dir).returns({resize:resizeStub});
//
//        // Act - this calls the tested method
//        testedModule.resize(dir, sizesObj, function (err) {
//            callbackSpy.apply(null, arguments);
//        });
//
//        expect(callbackSpy).has.been.called;
//    });
//});



//describe("resizer with error", function () {
//    var testedModule, dir, sizesObj, imgName, writeStub250, callbackSpy, resizeStub, gmSubClassStub, fakeResponse;
//
//    before(function () {
//
//        dir = "/tmp/";
//
//        fakeResponse = {Body: "rstest.png"};
//
//        sizesObj = {width: 250, height: 250};
//
//        imgName = "rstest.png";
//
//        writeStub250 = sinon.stub();
//
//        resizeStub = sinon.stub();
//
//        gmSubClassStub = sinon.stub();
//
//        callbackSpy = sinon.spy();
//
//        testedModule = proxyquire('../resizer', {
//            'gm': {subClass: sinon.stub().returns(gmSubClassStub)}
//        });
//
//    });
//
//    it("resizes image and call error on write", function () {
//
//        writeStub250.withArgs("/tmp/undefined-rstest.png").yields(new Error("Error resizing"));
//
//        resizeStub.withArgs(250).returns({write:writeStub250});
//
//        // Stub is used when you just want to simulate a returned value
//        gmSubClassStub.withArgs(imgName).returns({resize:resizeStub});
//
//        // Act - this calls the tested method
//        testedModule.resize(fakeResponse, imgName, dir, sizesObj, function (err) {
//            callbackSpy.apply(null, arguments);
//        });
//
//        // Assert
//        expect(resizeStub).has.been.called;
//        expect(writeStub250).contains(new Error("Error resizing"));
//        expect(callbackSpy).has.been.called.and.calledWith(new Error("Error resizing"));
//    });
//});



describe("readDirectory _getFiles._get", function () {
    describe("_get success call", function () {
        var testedModule, callbackSpy, readFileStub;

        before(function () {

            readFileStub = sinon.stub();

            callbackSpy = sinon.spy();

            testedModule = require('../lib/modules/readDirectory.js');

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

            testedModule = proxyquire('../lib/modules/readDirectory', {
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



describe("S3Handler", function () {
    describe("S3Handler._get", function () {
        var testedModule, source, callbackSpy, getStub, putStub, fakeResponse;

        before(function () {

            fakeResponse = {Body: "Body Content"};

            source = "s3://bucketName/image.jpg";

            callbackSpy = sinon.spy();

            getStub = sinon.stub();

            putStub = sinon.stub();

            testedModule = proxyquire("../lib/modules//S3Handler", {
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
            testedModule._get(source, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(null, fakeResponse);
        });

        it("fetch object from S3Bucket triggers error", function () {
            getStub.callsArgWith(1, new Error("Error fetching image!"), null);
            testedModule._get(source, function () {
                callbackSpy.apply(null, arguments);
            });

            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error fetching image!"), null);
        });
    });

//    describe("S3Handler._put", function () {
//        var testedModule, _path, content, data, bucketName, getStub, putStub, callbackSpy, fileName;
//
//        before(function () {
//
//            _path = "s3://bucketName/S3test.png";
//
//            fileName = "S3test.png";
//
//            content = new Buffer([1,2,3]);
//
//            callbackSpy = sinon.spy();
//
//            data = {
//                "Expiration": "12-12-2016"
//            };
//
//            putStub = sinon.stub();
//
//            getStub = sinon.stub();
//
//            testedModule = proxyquire("../S3Handler", {
//                'aws-sdk': {
//                    "S3": function () {
//                        return {
//                            getObject: getStub,
//                            putObject: putStub
//                        }
//                    }
//                }
//            });
//        });
//
//        it("put object to S3Bucket", function () {
//            putStub.callsArgWith(1, null, data);
//            testedModule._put(_path, fileName, function () {
//                callbackSpy.apply(null, arguments);
//            });
//
//            expect(callbackSpy).has.been.called.and.calledWith(null, data);
//        });
//
//        it("put object triggers error", function () {
//            putStub.callsArgWith(1, new Error("Error putting image to S3"), null);
//            testedModule._put(_path, fileName, function () {
//                callbackSpy.apply(null, arguments);
//            });
//
//            expect(callbackSpy).has.been.called.and.calledWith(new Error("Error putting image to S3"));
//        });
//    });
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

            testedModule = proxyquire("../lib/modules//sqsHandler", {
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

            testedModule = proxyquire("../lib/modules//sqsHandler", {
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

        testedModule = require("../lib/modules/objectCreator.js");
    });

    it("returns a newly formed object", function () {
        var result = testedModule.creator(fakePath, fakeObj);
        expect(result).to.be.ok;
        expect(result).contains("message");
        expect(result).contains("S3://bucketname/images/908798");
        expect(result).contains('{"message":{"url":"S3://bucketname/images/908798","sizes":["large","medium","small","thumbnail"]}}');
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

            testedModule = require("../lib/modules/writeFiles.js");

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

            testedModule = proxyquire('../lib/modules//writeFiles', {
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
