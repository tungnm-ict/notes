'use strict';

require('should');
const sinon = require('sinon');
const routerProxy = require('../../src/router/proxy');

describe('Tests for router wrapper', function() {
    let router;
    let proxiedRouter;
    let setup;
    let errorHandler;

    beforeEach(() => {
        router = {
            get: sinon.spy(),
            post: sinon.spy(),
            put: sinon.spy(),
            delete: sinon.spy(),
            use: sinon.spy(),
            param: sinon.spy(),
        };

        setup = sinon.spy(router => {
            router.use('/', () => {});
        });

        errorHandler = () => {};
    });

    describe('setup', () => {
        it('should proxy the router', () => {
            proxiedRouter = routerProxy.setup(router, setup, errorHandler);

            proxiedRouter.should.have.properties([
                'get',
                'post',
                'put',
                'delete',
                'use',
                'param',
            ]);

            setup.calledWith(proxiedRouter).should.be.true();

            router.use.calledWith(errorHandler).should.be.true();
        });
    });
});
