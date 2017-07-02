'use strict';

require('should');
const sinon = require('sinon');
const q = require('q');
const param = require('../../../src/api/router/param');

describe('Tests for api router param', function() {
    let req;

    beforeEach(() => {
        req = {};
    });

    describe('noteId', () => {
        let note;
        let user;

        beforeEach(() => {
            note = {};

            user = {
                note: sinon.stub().returns(q(note)),
            };

            req.currentUser = user;
        });

        it('should set the note in req if correct note id', () => {
            return param.noteId(req, 20).then(() => {
                req.currentUser.note.calledWithExactly(20).should.be.true();
                req.note.should.equal(note);
            });
        });
    });
});
