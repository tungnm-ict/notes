'use strict';

require('require.fresh')(module, require);
const should = require('should');
let config;

describe('Tests for config', function() {
    let NODE_ENV;

    beforeEach(() => {
        NODE_ENV = process.env.NODE_ENV;
    });

    afterEach(() => {
        process.env.NODE_ENV = NODE_ENV;
    });

    it('should throw an error if NODE_ENV is not defined', () => {
        (() => {
            delete process.env.NODE_ENV;
            config = require.fresh('../src/config');
        }).should.throw('NODE_ENV is not set.');
    });

    it('should throw an error if NODE_ENV is unknown', () => {
        process.env.NODE_ENV = 'unknown env';

        (() => {
            config = require.fresh('../src/config');
        }).should.throw('Unknown NODE_ENV.');
    });

    it('should returned a config based on on NODE_ENV', () => {
        process.env.NODE_ENV = 'test';

        config = require.fresh('../src/config');

        should.exist(config);
    });
});
