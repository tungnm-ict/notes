'use strict';

require('should');
const model = require('../../src/model');

describe('Tests for model User', function() {
    beforeEach(() => {
        return model.sequelize.sync({
            force: true
        });
    });

    describe('static method', () => {
        describe('createUser', () => {
            it('should create a user and encrypt the password', () => {
                return model.User.createUser('user1', 'password1').then(createdUser => {
                    createdUser.name.should.equal('user1');
                    createdUser.password.should.not.equal('user1');
                });
            });
        });
    });

    describe('instance method', () => {
        let user;

        beforeEach(() => {
            return model.User.createUser('user1', 'password1').then(_user => {
                user = _user;
            });
        });

        describe('verifyPassword', () => {
            it('should fulfill true if correct password', () => {
                return user.verifyPassword('password1').should.be.fulfilledWith(true);
            });

            it('should fulfill false if wrong password', () => {
                return user.verifyPassword('wrong password').should.be.fulfilledWith(false);
            });
        });

        describe('setPassword', () => {
            it('should set an encrypted password', () => {
                return user.setPassword('new password').then(() => {
                    return user.verifyPassword('new password').should.be.fulfilledWith(true);
                });
            });

            it('should not save the model', () => {
                return user.setPassword('new password').then(() => {
                    return model.User.findById(user.id).then(refreshedUser => {
                        return refreshedUser.verifyPassword('new password').should.be.fulfilledWith(false);
                    });
                });
            });
        });
    });
});
