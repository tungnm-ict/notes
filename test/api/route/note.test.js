'use strict';

const q = require('q');
require('should');
const sinon = require('sinon');
const route = require('../../../src/api/route');

describe('Tests for api route note', function() {
    let req;
    let res;
    let note;
    let user;

    beforeEach(() => {
        req = {};
        res = {
            json: sinon.spy(),
            sendStatus: sinon.spy(),
        };

        note = {
            expose: sinon.stub().returns('exposedNote'),
            update: sinon.stub().returns(q()),
            delete: sinon.stub().returns(q()),
        };

        user = {
            createNote: sinon.stub().returns(q(note)),
            notes: sinon.stub().returns(q([
                note,
                note,
                note,
            ])),
        };
    });

    describe('create', () => {
        it('should create a note then json expose it', () => {
            req.currentUser = user;
            req.body = {
                subject: 'some subject',
                body: 'some body',
            };

            return route.note.create(req, res).then(() => {
                req.currentUser.createNote.calledWithExactly(req.body).should.be.true();
                res.json.calledWithExactly('exposedNote').should.be.true();
            });
        });
    });

    describe('list', () => {
        it('should the json the list of exposed notes', () => {
            req.currentUser = user;

            return route.note.list(req, res).then(() => {
                req.currentUser.notes.calledWithExactly().should.be.true();
                res.json.calledWithExactly([
                    'exposedNote',
                    'exposedNote',
                    'exposedNote',
                ]).should.be.true();
            });
        });
    });

    describe('get', () => {
        it('should json the exposed note', () => {
            req.note = note;

            route.note.get(req, res);

            res.json.calledWithExactly('exposedNote').should.be.true();
        });
    });

    describe('update', () => {
        it('should update a note then json the exposed note', () => {
            req.note = note;

            req.body = {
                body: 'some body',
            };

            return route.note.update(req, res).then(() => {
                req.note.update.calledWithExactly(req.body).should.be.true();
                res.json.calledWithExactly('exposedNote').should.be.true();
            });
        });
    });

    describe('delete', () => {
        it('should delete a note then send 204 status', () => {
            req.note = note;

            return route.note.delete(req, res).then(() => {
                req.note.delete.calledWithExactly().should.be.true();
                res.sendStatus.calledWithExactly(204).should.be.true();
            });
        });
    });
});
