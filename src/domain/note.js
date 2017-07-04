'use strict';

const _ = require('lodash');
const model = require('../model');

class Note {
    constructor(note) {
        this._note = note;
        this.total_version=1;
    }

    get id() {
        return this._note.id;
    }

    get version() {
        return this._note.version;
    }

    get subject() {
        return this._note.subject;
    }

    get note_id() {
        return this._note.note_id;
    }

    expose() {
        var arr=_.pick(this._note, [
            'id',
            'subject',
            'body',
            'note_id',
            'version',
            'updatedAt',
            ]);
        arr.total_version =this.total_version;
        return arr;
    }

    update(note) {
        return this._note.update(note);
    }

    delete() {
        return this._note.destroy();
    }

    delete_all_version(note_id) {
        return model.Note.destroy({
            where: {
                note_id: note_id
            }
        });
    }
}

module.exports = Note;
