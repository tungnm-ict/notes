'use strict';

require('should');
const sinon = require('sinon');
const swig = require('swig');
const path = require('path');
const proxyquire = require('proxyquire');
const config = require('../src/config');
let main;

describe('Tests for main', function() {
    let http;
    let httpServer;
    let express;
    let expressApp;
    let expressStaticRouter;
    let apiRouter;
    let appRouter;

    beforeEach(() => {
        sinon.spy(swig, 'setDefaults');

        httpServer = {
            listen: sinon.spy(),
        };

        http = {
            createServer: sinon.stub().returns(httpServer),
        };

        expressApp = {
            engine: sinon.spy(),
            set: sinon.spy(),
            use: sinon.spy(),
        };

        expressStaticRouter = {};

        express = () => expressApp;
        express.static = () => expressStaticRouter;

        apiRouter = {};
        appRouter = {};

        main = proxyquire('../src/main.js', {
            http,
            express,
            './api/router': () => apiRouter,
            './app/router': () => appRouter,
        });
    });

    afterEach(() => {
        swig.setDefaults.restore();
    });

    it('should define the views with swig', () => {
        expressApp.engine.calledWithExactly('html', swig.renderFile).should.be.true();
        expressApp.set.calledWithExactly('view engine', 'html').should.be.true();
        expressApp.set.calledWithExactly('views',  path.resolve('./src/app/views')).should.be.true();
        expressApp.set.calledWithExactly('view cache', false).should.be.true();

        swig.setDefaults.calledWithExactly({
            cache: false
        }).should.be.true();
    });

    it('should register apiRouter, staticRouter then appRouter', () => {
        expressApp.use.calledWithExactly('/api', apiRouter).should.be.true();
        expressApp.use.calledWithExactly(expressStaticRouter).should.be.true();
        expressApp.use.calledWithExactly('/', appRouter).should.be.true();
    });

    it('should create a http server with the express ap', () => {
        http.createServer.calledWithExactly(expressApp).should.be.true();
        httpServer.listen.calledWithExactly(config.port).should.be.true();
    });
});
