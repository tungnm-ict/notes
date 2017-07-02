'use strict';

const _ = require('lodash');
const q = require('q');
require('should');
const domain = require('../../src/domain');
const model = require('../../src/model');

describe('Tests for domain User', function() {
    let userId1;
    let noteId1;
    let userId2;

    beforeEach(() => {
        return model.sequelize.sync({
            force: true
        }).then(() => {
            return q.all([
                model.User.createUser('user1', 'password1').then(user => {
                    userId1 = user.id;

                    return q.all(_.map(_.times(5, n => ({
                        subject: `subject ${ n }`,
                        body: `body ${ n }`,
                    })), note => {
                        return user.createNote(note);
                    })).then(notes => {
                        noteId1 = _.first(notes).id;
                    });
                }),
                model.User.createUser('user2', 'password2').then(user => {
                    userId2 = user.id;
                })
            ]);
        });
    });

    describe('static method', () => {
        describe('getById', () => {
            it('should get a user by its id', () => {
                return domain.User.getById(userId1).then(user => {
                    user.should.be.instanceOf(domain.User);
                });
            });

            it('should reject USER_NOT_FOUND if wrong id', () => {
                return domain.User.getById(-1).should.be.rejectedWith(domain.Error.Code.USER_NOT_FOUND.name);
            });
        });

        describe('getByName', () => {
            it('should get a user by its name', () => {
                return domain.User.getByName('user1').then(user => {
                    user.should.be.instanceOf(domain.User);
                });
            });

            it('should reject USER_NOT_FOUND if wrong name', () => {
                return domain.User.getByName('wrong name').should.be.rejectedWith(domain.Error.Code.USER_NOT_FOUND.name);
            });
        });
    });

    describe('instance method', () => {
        let domainUser1;
        let domainUser2;

        beforeEach(() => {
            return q.all([
                domain.User.getById(userId1).then(user => {
                    domainUser1 = user;
                }),
                domain.User.getById(userId2).then(user => {
                    domainUser2 = user;
                })
            ]);
        });

        describe('getters', () => {
            it('should get the id', () => {
                domainUser1.id.should.equal(userId1);
            });
        });

        describe('expose', () => {
            it('should expose the id and the name of the user', () => {
                domainUser1.expose().should.eql({
                    id: userId1,
                    name: 'user1',
                });
            });
        });

        describe('authenticate', () => {
            it('should fulfill if correct password', () => {
                return domainUser1.authenticate('password1').should.be.fulfilled();
            });

            it('should reject AUTHENTICATION_FAILED if wrong password', () => {
                return domainUser1.authenticate('wrong password').should.be.rejectedWith(domain.Error.Code.AUTHENTICATION_FAILED.name);
            });
        });

        describe('notes', () => {
            it('should return the Notes asociated with the User', () => {
                return domainUser1.notes().then(notes => {
                    notes.should.have.size(5);
                    _.each(notes, note => {
                        note.should.be.instanceOf(domain.Note);
                    });
                });
            });

            it('should return an empty array if no Notes', () => {
                return domainUser2.notes().then(notes => {
                    notes.should.be.empty();
                });
            });
        });

        describe('note', () => {
            it('should return a note by its id', () => {
                return domainUser1.note(noteId1).then(note => {
                    note.should.be.instanceOf(domain.Note);
                });
            });

            it('should reject NOTE_NOT_FOUND if wrong id', () => {
                return domainUser2.note(noteId1).should.be.rejectedWith(domain.Error.Code.NOTE_NOT_FOUND.name);
            });
        });

        describe('createNote', () => {
            it('should create a new note associated to the user', () => {
                return domainUser1.createNote({
                    subject: 'new subject',
                    body: 'new body'
                }).then(createdNote => {
                    return domainUser1.note(createdNote.id).should.be.fulfilled();
                });
            });
        });
    });
});
