'use strict';

module.exports.note_id = (req, note_id) => {
    return req.currentUser.note(note_id).then(note => {
        req.note = note;
    });
};
