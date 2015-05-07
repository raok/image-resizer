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
var nock = require("nock");
var proxyquire = require('proxyquire');





//describe('GruntHandler', function () {
//    var testedModule, configs, _sizesArray, gmSubclassStub, callbackStub, _getStub, _postStub, getReqStub, postReqStub, responseOptions;
//
//    before(function () {
//        var _800px = {
//            width: 800,
//            size: "large"
//        };
//
//        var _500px = {
//            width: 500,
//            size: "medium"
//        };
//
//        var _200px = {
//            width: 200,
//            size: "small"
//        };
//
//        var _45px = {
//            width: 45,
//            size: "thumbnail"
//        };
//
//        responseOptions = {
//            "access_token":"Yzk2MTNmYjkzMjg2YzlmMWZjZjlkZDA2OWYxMDg1MjFkMDAzZTRmZjQ0NDFhYThhYTYwZWM0MDVkMTFlYTU0Ng",
//            "expires_in":3600,
//            "token_type":"bearer",
//            "scope":"oauth2"
//        }
//
//        configs = {
//            "host": "http://hevnly.com",
//            "client_id": "1_3tk0nlxobfeoow0cw4w400k8o0g008ww00o44gookgskc8ggkw",
//            "client_secret": "38nay3fseqkg0cw80kk4scookoookoskc0c84c4ckkgk4884k8",
//            "grant_type": "client_credentials",
//            "environment": "develop"
//        }
//
//
//        _sizesArray = [_800px, _500px, _200px, _45px];
//
//        gmSubclassStub = sinon.stub();
//        callbackStub = sinon.stub();
//        getReqStub = sinon.stub(request, "get").yields(null, responseOptions);
//        postReqStub = sinon.stub(request, "post");
//        _getStub = sinon.stub().withArgs(null, configs, callbackStub).returns(getReqStub);
//        _postStub = sinon.stub().withArgs("test.jpg", _sizesArray, null, configs, callbackStub).returns(postReqStub);
//
//        testedModule = proxyquire('../index', {
//            'gm': {subClass: sinon.stub().returns(gmSubclassStub)},
//            'ApiCaller': {
//                _get: _getStub,
//                _post: _postStub
//            }
//        });
//    });


    //it("should call GruntHandler Write, apiCaller._get and apiCaller._post with NO ERROR", function () {
    //
    //    var filepath = 'test.jpg';
    //
    //    var writeStub = sinon.stub().callsArgWith(1, null);
    //
    //    // This is a stub that will return the correct spy for each iteration of the for loop
    //    var resizeStub = sinon.stub().returns({write: writeStub});
    //
    //    // Stub is used when you just want to simulate a returned value
    //    gmSubclassStub.withArgs(filepath).returns({resize:resizeStub});
    //
    //    testedModule.GruntHandler(filepath, _sizesArray, configs);
    //
    //    expect(writeStub).to.have.been.called;
    //    //expect(_getStub).to.have.been.called;
    //    //expect(_postStub).to.have.been.called;
    //});
    //
    //it("should call GruntHandler Write and save to correct folders", function () {
    //    // Arrange
    //    var filepath = 'test.jpg';
    //
    //    // Spies are the methods you expect were actually called
    //    var write800Spy = sinon.spy();
    //    var write500Spy = sinon.spy();
    //    var write200Spy = sinon.spy();
    //    var write45Spy = sinon.spy();
    //
    //    // This is a stub that will return the correct spy for each iteration of the for loop
    //    var resizeStub = sinon.stub();
    //    resizeStub.withArgs(800).returns({write:write800Spy});
    //    resizeStub.withArgs(500).returns({write:write500Spy});
    //    resizeStub.withArgs(200).returns({write:write200Spy});
    //    resizeStub.withArgs(45).returns({write:write45Spy});
    //
    //    // Stub is used when you just want to simulate a returned value
    //    gmSubclassStub.withArgs(filepath).returns({resize:resizeStub});
    //
    //    // Act - this calls the tested method
    //    testedModule.GruntHandler(filepath, _sizesArray, configs);
    //
    //    // Assert
    //    expect(write800Spy).calledWith("large_test.jpg");
    //    expect(write500Spy).calledWith("medium_test.jpg");
    //    expect(write200Spy).calledWith("small_test.jpg");
    //    expect(write45Spy).calledWith("thumbnail_test.jpg");
    //});

//    it("should call GruntHandler and pass the wrong file type", function () {
//
//        var filepath = 'test.txt';
//
//        var errorStub = sinon.stub();
//
//        gmSubclassStub.withArgs(filepath).returns(errorStub);
//
//        expect(testedModule.GruntHandler(filepath, _sizesArray)).to.equal(undefined);
//    });
//
//    it("should call GruntHandler and pass the wrong file type", function () {
//
//        var filepath = 'test.gif';
//
//        var errorStub = sinon.stub();
//
//        gmSubclassStub.withArgs(filepath).returns(errorStub);
//
//        expect(testedModule.GruntHandler(filepath, _sizesArray)).to.equal(undefined);
//    });
//});



//describe('AwsHandler', function () {
//
//    var expect = chai.expect;
//
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
//    describe('process the image when it has jpg extension', function () {
//        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse, getStub, postStub;
//
//        before(function (done) {
//
//            fakeResponse = { Body: 'image content' };
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "image.jpg";
//
//            gmStubs = getGmStubs();
//            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
//            putObjectStub = sinon.stub().callsArgWith(1, null);
//            getStub = sinon.stub();
//            postStub = sinon.stub();
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub, getStub, postStub);
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
//                    Key: s.size + event.Records[0].s3.object.key,
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
//    describe('process the image when it has png extension', function () {
//        var event, gmStubs, getObjectStub, putObjectStub, contextDoneSpy, testedModule, fakeResponse, getStub, postStub;
//
//        before(function (done) {
//            fakeResponse = { Body: 'image content' };
//            event = extend({}, baseEvent);
//            event.Records[0].s3.object.key = "image.png";
//
//            gmStubs = getGmStubs();
//            getObjectStub = sinon.stub().callsArgWith(1, null, fakeResponse);
//            putObjectStub = sinon.stub().callsArgWith(1, null);
//            getStub = sinon.stub();
//            postStub = sinon.stub();
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectStub, getStub, postStub);
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
//                    Key: s.size + event.Records[0].s3.object.key,
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
//        var event, gmStubs, getObjectStub, putObjectSpy, contextDoneSpy, testedModule, fakeResponse, getStub, postStub;
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
//            getStub = sinon.stub();
//            postStub = sinon.stub();
//            contextDoneSpy = sinon.spy();
//
//            testedModule = getTestedModule(gmStubs.gm, getObjectStub, putObjectSpy, getStub, postStub);
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
//function getTestedModule(gm, getObject, putObject, _get, _post) {
//    return proxyquire('../index.js', {
//        'gm': { subClass: function() { return gm; } },
//        'aws-sdk': {
//            "S3": function () {
//                return {
//                    getObject: getObject,
//                    putObject: putObject
//                };
//            }
//        },
//        'ApiCaller': function () {
//            return {
//                _get: _get,
//                _post: _post
//            }
//        }
//    });
//}

describe("ApiCaller - Success calls - apiCaller._get", function () {

    var callbackSpy, reqGetStb, config, responseOptions, testedModule, params;

    before(function () {

        nock.enableNetConnect();

        config = {
            "host": "https://www.wherever.com",
            "client_id": "somethinggood",
            "client_secret": "alongpassword",
            "grant_type": "client_credentials",
            "environment": "live"
        };

        params = "client_id=somethinggood&client_secret=alongpassword&grant_type=client_credentials";

        responseOptions = {access_token: "123456789"};

        callbackSpy = sinon.spy();
        reqGetStb = sinon.stub();

        testedModule = proxyquire("../apiCaller", {
            "request" : {
                "get": reqGetStb
            }
        });

    });

    after(function () {
        nock.disableNetConnect();
    });

    it("trigger callback with token", function (done) {

        reqGetStb.yields(null, {statusCode: 200}, responseOptions);

        testedModule._get(config, null, function (error, result) {
            if ( error ) {
                return done(error);
            }
            callbackSpy.apply(null, arguments);
            expect(reqGetStb).to.have.been.called;
            expect(callbackSpy).to.have.been.called.and.calledWith(null, responseOptions.access_token);
            done();
        });
    });
});

describe("ApiCaller - Errors - apiCaller._get", function () {
    describe("request error", function () {
        var callbackSpy, reqGetStb, config, responseOptions, testedModule, params, contextSpy;

        before(function () {

            nock.enableNetConnect();

            config = {
                "host": "https://www.wherever.com",
                "client_id": "somethinggood",
                "client_secret": "alongpassword",
                "grant_type": "client_credentials",
                "environment": "live"
            };

            params = "client_id=somethinggood&client_secret=alongpassword&grant_type=client_credentials";

            responseOptions = {access_token: "123456789"};

            callbackSpy = sinon.spy();
            contextSpy = sinon.spy();
            reqGetStb = sinon.stub();

            testedModule = proxyquire("../apiCaller", {
                "request" : {
                    "get": reqGetStb
                }
            });

        });

        after(function () {
            nock.disableNetConnect();
        });

        it("triggers error on request, no context", function (done) {

            reqGetStb.yields(new Error("There was an error with the request"), {statusCode: 500}, "Bad request");

            testedModule._get(config, null, function (error, result) {
                if ( error ) {
                    callbackSpy.apply(null, arguments);
                    expect(reqGetStb).to.have.been.called;
                    expect(callbackSpy).to.have.been.called.and.calledWith(new Error("There was an error with the request"));
                    done();
                }
            });
        });
    });
});