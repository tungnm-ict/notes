'use strict';

require('should');
const sinon = require('sinon');
const routerProxy = require('../../src/router/proxy');
const route = require('../../src/api/route');
const apiParam = require('../../src/api/router/param');
const apiMiddleware = require('../../src/api/router/middleware');
const apiRouter = require('../../src/api/router');

describe('Tests for api router', function() {
    beforeEach(() => {
        sinon.spy(routerProxy, 'setup');

        apiRouter();
    });

    afterEach(() => {
        routerProxy.setup.restore();
    });

    describe('setup', () => {
        let setup;
        let router;

        beforeEach(() => {
            setup = routerProxy.setup.args[0][1];

            router = {
                get: sinon.spy(),
                post: sinon.spy(),
                put: sinon.spy(),
                delete: sinon.spy(),
                param: sinon.spy(),
                use: sinon.spy(),
            };

            setup(router);
        });

        it('should setup the router', function() {
            router.get.callCount.should.equal(3);
            router.post.callCount.should.equal(2);
            router.put.callCount.should.equal(1);
            router.delete.callCount.should.equal(2);
            router.use.callCount.should.equal(2);
            router.param.callCount.should.equal(1);
        });

        it('should setup the middlewares', () => {
            router.use.calledWithExactly(apiMiddleware.startSession).should.be.true();
            router.use.calledWithExactly(apiMiddleware.checkAuthentication).should.be.true();
        });

        it('should setup the params', () => {
            router.param.calledWithExactly('noteId', apiParam.noteId).should.be.true();
        });

        it('should setup the routes', () => {
            // Session
            router.post.calledWithExactly(
                '/sessions',
                apiMiddleware.jsonParser,
                route.session.create
            ).should.be.true();
            router.get.calledWithExactly(
                '/sessions/current',
                route.session.get
            ).should.be.true();
            router.delete.calledWithExactly(
                '/sessions/:sessionId',
                route.session.delete
            ).should.be.true();

            // Note
            router.get.calledWithExactly(
                '/notes',
                route.note.list
            ).should.be.true();
            router.post.calledWithExactly(
                '/notes',
                apiMiddleware.jsonParser,
                route.note.create
            ).should.be.true();
            router.get.calledWithExactly(
                '/notes/:noteId',
                route.note.get
            ).should.be.true();
            router.put.calledWithExactly(
                '/notes/:noteId',
                apiMiddleware.jsonParser,
                route.note.update
            ).should.be.true();
            router.delete.calledWithExactly(
                '/notes/:noteId',
                route.note.delete
            ).should.be.true();
        });
    });
});
