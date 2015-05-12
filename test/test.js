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
var fs = require('fs');
var mockDir = require('mock-fs');



describe('AwsHandler', function () {
    var expect = chai.expect;
    var sizesConfigs = [
        { width: 800, size: 'large' },
        { width: 500, size: 'medium' },
        { width: 200, size: 'small' },
        { width: 45, size: 'thumbnail'}
    ];
    var baseEvent = {
        "Records": [
            { "s3": {
                "bucket": { "name": "testbucket" },
                "object": { "key": null }
            }
            }
        ]
    };

    describe('reject to process non recognised image file extensions', function () {
        var event, gmSpy, getObjectSpy, putObjectSpy, contextDoneSpy, testedModule;

        before(function () {
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "no-supported.gif";
            gmSpy = sinon.spy();
            getObjectSpy = sinon.spy();
            putObjectSpy = sinon.spy();
            contextDoneSpy = sinon.spy();
            testedModule = getTestedModule(gmSpy, getObjectSpy, putObjectSpy);
            testedModule.AwsHandler(event, { done: contextDoneSpy });
        });

        it('never call s3 getObject', function () {
            expect(getObjectSpy).has.not.been.called;
        });
        it('never call graphics magick', function () {
            expect(gmSpy).has.not.been.called;
        });
        it('never call s3 putObject', function () {
            expect(putObjectSpy).has.not.been.called;
        });
        it('call context done with error', function () {
            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(new Error());
        });
    });

    describe('process the image when the it has jpg extension', function () {
        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse;

        before(function (done) {
            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.jpg";

            gmStubs = getGmStubs();
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectStub = sinon.stub().callsArgWith(1, null);
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub);
            testedModule.AwsHandler(event, { done: function () {
                contextDoneSpy.apply(null, arguments);
                done();
            }});
        });

        it('call s3 getObject', function () {
            expect(getObjectStub).has.been.calledOnce;
            expect(getObjectStub).has.been.calledWith({
                Bucket: event.Records[0].s3.bucket.name,
                Key: event.Records[0].s3.object.key
            });
        });

        it('call graphics magick', function () {
            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);

            sizesConfigs.forEach(function(s) {
                expect(gmStubs.resize).has.been.calledWith(s.width);
                expect(gmStubs.toBuffer).has.been.calledWith('jpg');
            });
        });

        it('call s3 putObject', function () {
            expect(putObjectStub).has.been.callCount(sizesConfigs.length);

            sizesConfigs.forEach(function(s) {
                expect(putObjectStub).has.been.calledWith({
                    Bucket: event.Records[0].s3.bucket.name,
                    Key: s.size + '_' + event.Records[0].s3.object.key,
                    Body: 'data',
                    ContentType: 'image/jpg'
                });
            });
        });

        it('call context done with no error', function () {
            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
        });
    });

    describe('process the image when the it has jpge extension', function () {
        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse;

        before(function (done) {
            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.jpge";

            gmStubs = getGmStubs();
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectStub = sinon.stub().callsArgWith(1, null);
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub);
            testedModule.AwsHandler(event, { done: function () {
                contextDoneSpy.apply(null, arguments);
                done();
            }});
        });

        it('call s3 getObject', function () {
            expect(getObjectStub).has.been.calledOnce;
            expect(getObjectStub).has.been.calledWith({
                Bucket: event.Records[0].s3.bucket.name,
                Key: event.Records[0].s3.object.key
            });
        });

        it('call graphics magick', function () {
            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);

            sizesConfigs.forEach(function(s) {
                expect(gmStubs.resize).has.been.calledWith(s.width);
                expect(gmStubs.toBuffer).has.been.calledWith('jpg');
            });
        });

        it('call s3 putObject', function () {
            expect(putObjectStub).has.been.callCount(sizesConfigs.length);

            sizesConfigs.forEach(function(s) {
                expect(putObjectStub).has.been.calledWith({
                    Bucket: event.Records[0].s3.bucket.name,
                    Key: s.size + '_' + event.Records[0].s3.object.key,
                    Body: 'data',
                    ContentType: 'image/jpg'
                });
            });
        });

        it('call context done with no error', function () {
            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
        });
    });

    describe('process the image when the it has png extension', function () {
        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse;

        before(function (done) {
            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.png";

            gmStubs = getGmStubs();
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectStub = sinon.stub().callsArgWith(1, null);
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub);
            testedModule.AwsHandler(event, { done: function () {
                contextDoneSpy.apply(null, arguments);
                done();
            }});
        });

        it('call s3 getObject', function () {
            expect(getObjectStub).has.been.calledOnce;
            expect(getObjectStub).has.been.calledWith({
                Bucket: event.Records[0].s3.bucket.name,
                Key: event.Records[0].s3.object.key
            });
        });

        it('call graphics magick', function () {
            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);

            sizesConfigs.forEach(function(s) {
                expect(gmStubs.resize).has.been.calledWith(s.width);
                expect(gmStubs.toBuffer).has.been.calledWith('png');
            });
        });

        it('call s3 putObject', function () {
            expect(putObjectStub).has.been.callCount(sizesConfigs.length);

            sizesConfigs.forEach(function(s) {
                expect(putObjectStub).has.been.calledWith({
                    Bucket: event.Records[0].s3.bucket.name,
                    Key: s.size + '_' + event.Records[0].s3.object.key,
                    Body: 'data',
                    ContentType: 'image/png'
                });
            });
        });

        it('call context done with no error', function () {
            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
        });
    });

    describe('process the image but image magick fails', function () {
        var event, gmStubs, getObjectStub, putObjectSpy, contextDoneSpy, testedModule, fakeResponse;

        before(function (done) {
            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.png";

            var toBufferStub = sinon.stub().callsArgWith(1, new Error('Image resize failed'));
            gmStubs = getGmStubs(toBufferStub);
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectSpy = sinon.spy();
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectSpy);
            testedModule.AwsHandler(event, { done: function () {
                contextDoneSpy.apply(null, arguments);
                done();
            }});
        });

        it('call s3 getObject', function () {
            expect(getObjectStub).has.been.calledOnce;
            expect(getObjectStub).has.been.calledWith({
                Bucket: event.Records[0].s3.bucket.name,
                Key: event.Records[0].s3.object.key
            });
        });

        it('call graphics magick', function () {
            expect(gmStubs.gm).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.resize).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.toBuffer).has.been.callCount(sizesConfigs.length);
            expect(gmStubs.gm).always.has.been.calledWith(fakeResponse.Body, event.Records[0].s3.object.key);

            sizesConfigs.forEach(function(s) {
                expect(gmStubs.resize).has.been.calledWith(s.width);
                expect(gmStubs.toBuffer).has.been.calledWith('png');
            });
        });

        it('never call s3 putObject', function () {
            expect(putObjectSpy).has.been.not.called;
        });

        it('call context done with no error', function () {
            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(new Error('Image resize failed'));
        });
    });
});

function getGmStubs(toBuffer) {
    var toBuffer = toBuffer || sinon.stub().callsArgWith(1, null, 'data')
    var resize = sinon.stub().returns({ toBuffer: toBuffer });
    var gm = sinon.stub().returns({ resize: resize });

    return {
        gm: gm,
        resize: resize,
        toBuffer: toBuffer
    };
}

function getTestedModule(gm, getObject, putObject) {
    return proxyquire('../index.js', {
        'gm': { subClass: function() { return gm; } },
        'aws-sdk': {
            "S3": function () {
                return {
                    getObject: getObject,
                    putObject: putObject
                };
            }
        }
    });
}

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
    var testedModule, dir, sizesObj, imgName, writeSpy250, writeSpy350, writeSpy500, resizeStub, gmSubClassStub;

    before(function () {

        dir = "/tmp/images";

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
        testedModule.resize(dir, sizesObj, imgName);

        // Assert
        expect(writeSpy250).calledWith("/tmp/images/thumb_test.png");
        expect(writeSpy350).calledWith("/tmp/images/small_test.png");
        expect(writeSpy500).calledWith("/tmp/images/medium_test.png");
    });
});

describe("resizer with error", function () {
    var testedModule, dir, sizesObj, imgName, writeStub250, writeStub350, writeStub500, resizeStub, gmSubClassStub;

    before(function () {

        dir = "/tmp/images";

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
        testedModule.resize(dir, sizesObj, imgName);

        // Assert
        expect(resizeStub).has.been.called;
        expect(writeStub250).contains(new Error("Error resizing"));
        expect(writeStub350).contains(new Error("Error resizing"));
        expect(writeStub500).contains(new Error("Error resizing"));
    });
});

describe("readDirectory", function () {
    var testedModule, readdirStub, callbackSpy;

    testedModule = require('../readDirectory.js');

    before(function () {

        mockDir({
            tmp: {
                images: {
                    thumb: {
                        thumb_test: "thumbnail pic"
                    },
                    small : {
                        small_test: "small pic"
                    },
                    medium: {
                        medium_test: "medium pic"
                    }
                }
            }
        });

        readdirStub = sinon.stub(fs, 'readdir');

        callbackSpy = sinon.spy();
    });

    after(function () {
        mockDir.restore();
        fs.readdir.restore();
    });

    it("call readdir with fake directory", function () {
        testedModule._get(mockDir, function () {console.log("Hello");});

        expect(readdirStub).to.have.been.called.and.calledWith(mockDir);
    });

    it("should return list of files", function () {
        readdirStub.withArgs(mockDir).callsArgWith(1, null, ["thumb_test", "small_test", "medium_test"]);
        testedModule._get(mockDir, function () {
            callbackSpy.apply(null, ["thumb_test", "small_test", "medium_test"]);
        });
        expect(readdirStub).has.been.called;
        expect(callbackSpy).has.been.called.and.calledWith("thumb_test", "small_test", "medium_test");
    });
});