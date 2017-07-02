'use strict';

module.exports.noteId = (req, noteId) => {
    return req.currentUser.note(noteId).then(note => {
        req.note = note;
    });
};
