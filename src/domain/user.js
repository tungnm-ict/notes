'use strict';

const _ = require('lodash');
const q = require('q');
const model = require('../model');
const domain = require('../domain');

class User {
    constructor(user) {
        this._user = user;
    }

    get id() {
        return this._user.id;
    }

    expose() {
        return _.pick(this._user, [
            'id',
            'name'
        ]);
    }

    authenticate(password) {
        return this._user.verifyPassword(password).then(result => {
            if (!result) {
                return q.reject(new domain.Error(domain.Error.Code.AUTHENTICATION_FAILED));
            }
            else {
                return q();
            }
        });
    }

    notes() {
        return this._user.getNotes({
            order: [['updatedAt', 'DESC']],
        }).then(notes => {
            return _.map(notes, note => {
                return new domain.Note(note);
            });
        });
    }

    note(id) {
        return this._user.getNotes({
            where: {
                id
            },
        }).then(notes => {
            if (_.size(notes) !== 1) {
                return q.reject(new domain.Error(domain.Error.Code.NOTE_NOT_FOUND));
            }
            else {
                return new domain.Note(notes[0]);
            }
        });
    }

    createNote(note) {
        return this._user.createNote(note).then(modelNote => {
            return new domain.Note(modelNote);
        });
    }

    static getById(id) {
        return model.User.findOne({
            where: {
                id
            }
        }).then(modelUser => {
            if (!modelUser) {
                return q.reject(new domain.Error(domain.Error.Code.USER_NOT_FOUND));
            }
            else {
                return new User(modelUser);
            }
        });
    }

    static getByName(name) {
        return model.User.findOne({
            where: {
                name
            }
        }).then(modelUser => {
            if (!modelUser) {
                return q.reject(new domain.Error(domain.Error.Code.USER_NOT_FOUND));
            }
            else {
                return new User(modelUser);
            }
        });
    }
}

module.exports = User;
