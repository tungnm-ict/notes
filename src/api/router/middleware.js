'use strict';

const q = require('q');
const bodyParser = require('body-parser');
const session = require('express-session');
const BaseError = require('../../baseError');
const ApiError = require('../error');
const config = require('../../config');
const domain = require('../../domain');

const jsonParser = bodyParser.json();

module.exports.startSession = session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
});

module.exports.jsonParser = jsonParser;

module.exports.checkAuthentication = (req, res) => {
    if (req.session.userId) {
        return domain.User.getById(req.session.userId).then(user => {
            req.currentUser = user;
        }).catch(error => {
            return q.reject(new ApiError(ApiError.Code.AUTHENTICATION_REQUIRED));
        });
    }
    else {
        return q.reject(new ApiError(ApiError.Code.AUTHENTICATION_REQUIRED));
    }
};

module.exports.errorHandler = (e, req, res, next) => {
    console.log(e.message);

    if (res.headersSent) {
        return next(e);
    }
    else if (e instanceof BaseError) {
        res.status(e.notFound ? 404 : 400);
        res.json({
            code: e.codeName,
        });
    }
    else {
        res.status(500);
        res.json({
            code: ApiError.Code.INTERNAL_SERVER_ERROR.name,
        });
    }
};
