'use strict';

require('should');
const sinon = require('sinon');
const routerProxy = require('../../src/router/proxy');
const route = require('../../src/app/route');
const appRouter = require('../../src/app/router');

describe('Tests for app router', function() {
    beforeEach(() => {
        sinon.spy(routerProxy, 'setup');

        appRouter();
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
            };

            setup(router);
        });

        it('should setup the routes', () => {
            router.get.calledWithExactly('/', route.index).should.be.true();
        });
    });
});
