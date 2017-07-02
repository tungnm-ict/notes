'use strict';

const q = require('q');
const RouterError = require('./error');

module.exports.routeNotFound = (req, res) => {
    return q.reject(new RouterError(RouterError.Code.NOT_FOUND));
};
