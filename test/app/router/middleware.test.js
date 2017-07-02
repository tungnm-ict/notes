'use strict';

require('should');
const sinon = require('sinon');
const middleware = require('../../../src/app/router/middleware');

describe('Tests for app router middleware', function() {
    const req = {};
    let res;

    beforeEach(() => {
        res = {
            render: sinon.spy(),
        };
        res.status = sinon.stub().returns(res);
    });

    describe('errorHandler', () => {
        const e = new Error('Error');

        it('should render the error page', () => {
            middleware.errorHandler(e, req, res);

            res.status.calledWithExactly(404).should.be.true();
            res.render.calledWithExactly('error').should.be.true();
        });
    });
});
