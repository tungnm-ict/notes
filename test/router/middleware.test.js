'use strict';

require('should');
const middleware = require('../../src/router/middleware');
const RouterError = require('../../src/router/error');

describe('Tests for router middleware', function() {
    let req;
    let res;

    describe('routeNotFound', () => {
        it('should reject a NOT_FOUND error', () => {
            middleware.routeNotFound(req, res).should.be.rejectedWith(RouterError.Code.NOT_FOUND.name);
        });
    });
});
