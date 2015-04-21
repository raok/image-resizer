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
//var nock = require('nock');

var proxyquire = require('proxyquire');





describe('GruntHandler', function () {

    var gmSubclassStub = sinon.stub();

    var testedModule = proxyquire('../index', {
        'gm': {subClass: sinon.stub().returns(gmSubclassStub)},
        'ApiCaller': function () {
            return {
                _get: _get,
                _post: _post
            }
        }
    });

    var _800px = {
        width: 800,
        destinationPath: "large"
    };

    var _500px = {
        width: 500,
        destinationPath: "medium"
    };

    var _200px = {
        width: 200,
        destinationPath: "small"
    };

    var _45px = {
        width: 45,
        destinationPath: "thumbnail"
    };

    var _sizesArray = [_800px, _500px, _200px, _45px];



    it("should call GruntHandler Write with NO ERROR", function () {

        var filepath = 'test.png';

        var writeStub = sinon.stub().callsArgWith(1, null);

        // This is a stub that will return the correct spy for each iteration of the for loop
        var resizeStub = sinon.stub().returns({write: writeStub});

        // Stub is used when you just want to simulate a returned value
        gmSubclassStub.withArgs(filepath).returns({resize:resizeStub});

        testedModule.GruntHandler(filepath, _sizesArray);

        expect(writeStub).to.have.been.called;
    });

    it("should call GruntHandler Write and save to correct folders", function () {
        // Arrange
        var filepath = 'test.jpg';

        // Spies are the methods you expect were actually called
        var write800Spy = sinon.spy();
        var write500Spy = sinon.spy();
        var write200Spy = sinon.spy();
        var write45Spy = sinon.spy();

        // This is a stub that will return the correct spy for each iteration of the for loop
        var resizeStub = sinon.stub();
        resizeStub.withArgs(800).returns({write:write800Spy});
        resizeStub.withArgs(500).returns({write:write500Spy});
        resizeStub.withArgs(200).returns({write:write200Spy});
        resizeStub.withArgs(45).returns({write:write45Spy});

        // Stub is used when you just want to simulate a returned value
        gmSubclassStub.withArgs(filepath).returns({resize:resizeStub});

        // Act - this calls the tested method
        testedModule.GruntHandler(filepath, _sizesArray);

        // Assert
        expect(write800Spy).calledWith("dst/large/test.jpg");
        expect(write500Spy).calledWith("dst/medium/test.jpg");
        expect(write200Spy).calledWith("dst/small/test.jpg");
        expect(write45Spy).calledWith("dst/thumbnail/test.jpg");
    });

    it("should call GruntHandler and pass the wrong file type", function () {

        var filepath = 'test.txt';

        var errorStub = sinon.stub();

        gmSubclassStub.withArgs(filepath).returns(errorStub);

        expect(testedModule.GruntHandler(filepath, _sizesArray)).to.equal(undefined);
    });

    it("should call GruntHandler and pass the wrong file type", function () {

        var filepath = 'test.gif';

        var errorStub = sinon.stub();

        gmSubclassStub.withArgs(filepath).returns(errorStub);

        expect(testedModule.GruntHandler(filepath, _sizesArray)).to.equal(undefined);
    });
});



describe('AwsHandler', function () {

    var expect = chai.expect;
    //var eventEmitter = require('events').EventEmitter;

    var sizesConfigs = [
        { width: 800, destinationPath: 'large' },
        { width: 500, destinationPath: 'medium' },
        { width: 200, destinationPath: 'small' },
        { width: 45, destinationPath: 'thumbnail'}
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

    describe('process the image when it has jpg extension', function () {
        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse, getStub, postStub;

        before(function (done) {

            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.jpg";

            gmStubs = getGmStubs();
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectStub = sinon.stub().callsArgWith(1, null);
            getStub = sinon.stub();
            postStub = sinon.stub();
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub, getStub, postStub);
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
                    Key: s.destinationPath + event.Records[0].s3.object.key,
                    Body: 'data',
                    ContentType: 'image/jpg'
                });
            });
        });

        it('call context done with no error', function () {
            expect(contextDoneSpy).has.been.calledOnce.and.calledWith(null);
        });
    });

    describe('process the image when it has png extension', function () {
        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse, getStub, postStub;

        before(function (done) {
            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.png";

            gmStubs = getGmStubs();
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectStub = sinon.stub().callsArgWith(1, null);
            getStub = sinon.stub();
            postStub = sinon.stub();
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub, getStub, postStub);
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
                    Key: s.destinationPath + event.Records[0].s3.object.key,
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
        var event, gmStubs, getObjectStub, putObjectSpy, contextDoneSpy, testedModule, fakeResponse, getStub, postStub;

        before(function (done) {
            fakeResponse = { Body: 'image content' };
            event = extend({}, baseEvent);
            event.Records[0].s3.object.key = "image.png";

            var toBufferStub = sinon.stub().callsArgWith(1, new Error('Image resize failed'));
            gmStubs = getGmStubs(toBufferStub);
            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
            putObjectSpy = sinon.spy();
            getStub = sinon.stub();
            postStub = sinon.stub();
            contextDoneSpy = sinon.spy();

            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectSpy, getStub, postStub);
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

function getTestedModule(gm, getObject, putObject, _get, _post) {
    return proxyquire('../index.js', {
        'gm': { subClass: function() { return gm; } },
        'aws-sdk': {
            "S3": function () {
                return {
                    getObject: getObject,
                    putObject: putObject
                };
            }
        },
        'ApiCaller': function () {
            return {
                _get: _get,
                _post: _post
            }
        }
    });
}


