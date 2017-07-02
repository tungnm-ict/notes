'use strict';

const q = require('q');
const domain = require('../../domain');
const ApiError = require('../error');

module.exports.get = (req, res) => {
    res.json({
        id: req.sessionID,
        user: req.currentUser.expose()
    });
};

module.exports.create = (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    return domain.User.getByName(name).then(user => {
        return user.authenticate(password).then(() => {
            return q.ninvoke(req.session, 'regenerate').then(() => {
                req.session.userId = user.id;

                res.json({
                    id: req.sessionID,
                    user: user.expose()
                });
            });
        });
    }).catch(e => {
        if (e.name === domain.Error.errorName) {
            return q.reject(new ApiError(ApiError.Code.AUTHENTICATION_FAILED));
        }
        else {
            return q.reject(e);
        }
    });
};

module.exports.delete = (req, res) => {
    const sessionId = req.params.sessionId;

    if (sessionId === req.sessionID) {
        req.session.destroy();
        res.json({});
        return q();
    }
    else {
        return q.reject(new ApiError(ApiError.Code.SESSION_NOT_FOUND));
    }
};
