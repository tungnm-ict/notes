'use strict';

require('should');
const BaseError = require('../src/baseError');

describe('Tests for BaseError', function() {
    const baseError = new BaseError({
        name: 'some name',
        notFound: true
    });

    describe('getter', () => {
        it('should throw an error for the name', () => {
            (() => {
                return baseError.name;
            }).should.throw('This getter must be overridden.');
        });

        it('should get the code name with the message', () => {
            baseError.message.should.equal('some name');
        });

        it('should get the code', () => {
            baseError.code.should.eql({
                name: 'some name',
                notFound: true
            });
        });

        it('should get the codeName', () => {
            baseError.codeName.should.equal('some name');
        });

        it('should get the notFound property', () => {
            baseError.notFound.should.be.true();
        });
    });
});
