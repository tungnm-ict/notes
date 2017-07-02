'use strict';

const q = require('q');

function wrapRoute(route) {
    return (req, res, next) => {
        q(route(req, res)).catch(next).done();
    };
}

function wrapParam(paramToWrap) {
    return (req, res, next, param) => {
        q(paramToWrap(req, param)).then(() => {
            next();
        }).catch(next).done();
    };
}

function wrap(middleware) {
    if (middleware.length === 2) {
        return (req, res, next) => {
            q(middleware(req, res)).then(result => {
                if (result === 'route') {
                    next('route');
                }
                else {
                    next();
                }
            }).catch(next).done();
        };
    }
    else {
        return middleware;
    }

}

module.exports = {
    wrapRoute,
    wrapParam,
    wrap,
};
