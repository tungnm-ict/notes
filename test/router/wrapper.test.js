'use strict';

const q = require('q');
require('should');
const sinon = require('sinon');
const routerWrapper = require('../../src/router/wrapper');

describe('Tests for router wrapper', function() {
    let req;
    let res;
    let next;
    let param;

    function runP(wrap, routeParamOrParserOrMiddleware) {
        return q.Promise(function(resolve, reject) {
            next = sinon.spy(resolve);
            wrap(routeParamOrParserOrMiddleware)(req, res, next, param);
        });
    }

    beforeEach(() => {
        req = {};
        res = {};
        param = {};
    });

    describe('wrapRoute', () => {
        it('should call the route if success', () => {
            const route = sinon.spy();
            next = sinon.spy();

            routerWrapper.wrapRoute(route)(req, res, next);
            route.calledWithExactly(req, res).should.be.true();
            next.called.should.be.false();
        });

        it('should call next with rejection', () => {
            const error = new Error('Error');
            const route = sinon.spy(() => {
                return q.reject(error);
            });

            return runP(routerWrapper.wrapRoute, route).then(() => {
                route.calledWithExactly(req, res).should.be.true();
                next.calledWithExactly(error).should.be.true();
            });
        });
    });

    describe('wrapParam', () => {
        it('should call next if paramToWrap success', () => {
            const paramToWrap = sinon.spy();

            return runP(routerWrapper.wrapParam, paramToWrap).then(() => {
                paramToWrap.calledWithExactly(req, param).should.be.true();
                next.calledWithExactly().should.be.true();
            });
        });

        it('should call next with not arguments if paramToWrap fulfilled with a value', () => {
            const paramToWrap = sinon.spy(() => {
                return q('something');
            });

            return runP(routerWrapper.wrapParam, paramToWrap).then(() => {
                paramToWrap.calledWithExactly(req, param).should.be.true();
                next.calledWithExactly().should.be.true();
            });
        });

        it('should call next with rejection', () => {
            const error = new Error('Error');
            const paramToWrap = sinon.spy(() => {
                return q.reject(error);
            });

            return runP(routerWrapper.wrapParam, paramToWrap).then(() => {
                paramToWrap.calledWithExactly(req, param).should.be.true();
                next.calledWithExactly(error).should.be.true();
            });
        });
    });

    describe('wrap', () => {
        it('should call next if middleware resolved', () => {
            const middleware = sinon.spy(function(req, res) {
                return q();
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly().should.be.true();
                next.callCount.should.equal(1);
            });
        });

        it('should call next with no param if middleware resolved with result', () => {
            const middleware = sinon.spy(function(req, res) {
                return q('some results');
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly().should.be.true();
                next.callCount.should.equal(1);
            });
        });

        it('should call next with `route` only if middleware resolved with `route`', () => {
            const middleware = sinon.spy(function(req, res) {
                return q('route');
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly('route').should.be.true();
                next.callCount.should.equal(1);
            });
        });

        it('should call next if middleware returns undefined', () => {
            const middleware = sinon.spy(function(req, res) {
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly().should.be.true();
                next.callCount.should.equal(1);
            });
        });

        it('should be compatible with standard middleware calling next with param', () => {
            const middleware = sinon.spy(function(req, res, next) {
                next('route');
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly('route').should.be.true();
                next.callCount.should.equal(1);
            });
        });

        it('should be compatible with an async standard middleware calling next with param', () => {
            const middleware = sinon.spy(function(req, res, next) {
                setTimeout(() => {
                    next('route');
                }, 100);
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly('route').should.be.true();
                next.callCount.should.equal(1);
            });
        });

        it('should call next with rejection', () => {
            const error = new Error('Error');
            const middleware = sinon.spy(function(req, res) {
                return q.reject(error);
            });

            return runP(routerWrapper.wrap, middleware).then(() => {
                middleware.calledWith(req, res).should.be.true();
                next.calledWithExactly(error).should.be.true();
                next.callCount.should.equal(1);
            });
        });
    });
});
