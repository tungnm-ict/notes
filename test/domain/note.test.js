'use strict';

const _ = require('lodash');
require('should');
const q = require('q');
const sinon = require('sinon');
const domain = require('../../src/domain');
const model = require('../../src/model');
const uuidV1 = require('uuid/v1');

describe('Tests for domain Note', function() {
    let noteId;
    let modelUser;
    let domainNote;
    let noteNote_id;
    let subject;
    let version;
    beforeEach(() => {
        return model.sequelize.sync({
            force: true
        }).then(() => {
            return model.User.createUser('user1', 'password1').then(user => {
                modelUser = user;

                return user.createNote({
                    subject: 'some subject',
                    body: 'some body',
                    note_id: uuidV1(),
                    version: '1',
                }).then(note => {
                    noteNote_id = note.note_id;
                    subject = note.subject;
                    version = note.version;
                    noteId = note.id;

                    domainNote = new domain.Note(note);
                });
            });
        });
    });

    describe('instance method', () => {
        describe('getters', () => {
            it('should get the note id', () => {
                domainNote.id.should.equal(noteId);
            });

            it('should get the note note_id', () => {
                domainNote.note_id.should.equal(noteNote_id);
            });

            it('should get the note subject', () => {
                domainNote.subject.should.equal(subject);
            });

            it('should get the note version', () => {
                domainNote.version.should.equal(version);
            });
        });

        describe('expose', () => {
            it('should expose the id, subject, body, note_id,version and updatedAt of the note', () => {
                domainNote.expose().should.match({
                    id: noteId,
                    subject: 'some subject',
                    body: 'some body',
                    note_id: noteNote_id,
                    version: 1,
                    updatedAt: _.isDate,
                    total_version: _.isNumber,
                });
            });
        });

        describe('update', () => {
            it('should update the body of the note', () => {
                return domainNote.update({
                    body: 'new body'
                }).then(() => {
                    domainNote.expose().should.match({
                        id: noteId,
                        subject: 'some subject',
                        body: 'new body',
                        note_id: noteNote_id,
                        version: 1,
                        updatedAt: _.isDate,
                        total_version: _.isNumber,
                    });
                });
            });
        });

        describe('delete', () => {
            it('should delete the note', () => {
                return domainNote.delete().then(() => {
                    return modelUser.getNotes().then(notes => {
                        notes.should.be.empty();
                    });
                });
            });
        });

        describe('delete_all_version', () => {
            it('should delete_all_version the note', () => {
                return domainNote.delete_all_version(noteNote_id).then(() => {
                    return modelUser.getNotes().then(notes => {
                        notes.should.be.empty();
                    });
                });
            });
        });
    });
});
