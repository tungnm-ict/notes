'use strict';

const _ = require('lodash');
const uuidV1 = require('uuid/v1');

module.exports.create = (req, res) => {
    req.body.note_id = uuidV1();
    req.body.version = 1;
    return req.currentUser.createNote(req.body).then(note => {
        res.json(note.expose());
    });
};

module.exports.list = (req, res) => {
    return req.currentUser.notes().then(notes => {
        res.json(_.invokeMap(notes, 'expose'));
    });
};

module.exports.get = (req, res) => {
    var json= req.note.expose();
    json.total_version = req.note.version;
    res.json(json);
};

module.exports.choose_ver = (req, res) => {
    return req.currentUser.choose_ver(req.note.note_id,req.params.version).then(note => {
        var json= note.expose();
        json.total_version = req.note.version;
        res.json(json);
    });
};

module.exports.update = (req, res) => {
    var note_update = {}
    note_update.subject = req.note.subject;
    note_update.note_id = req.note.note_id;
    note_update.version = req.note.version+1;
    note_update.body = req.body.body;

    return req.currentUser.createNote(note_update).then(note => {
        res.json(note.expose());
    });
    // return req.note.update({'body' : req.body.body}).then(() => {
    //     res.json(req.note.expose());
    // });
};

module.exports.delete = (req, res) => {
    return req.note.delete_all_version(req.note.note_id).then(() => {
        res.sendStatus(204);
    });
};
