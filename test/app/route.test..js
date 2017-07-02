'use strict';

require('should');
const sinon = require('sinon');
const route = require('../../src/app/route');

describe('Tests for app route', function() {
    const req = {};
    let res;

    beforeEach(() => {
        res = {
            render: sinon.spy(),
        };
    });

    describe('index', () => {
        it('should setup the router', () => {
            route.index(req, res);

            res.render.calledWithExactly('index').should.be.true();
        });
    });
});
