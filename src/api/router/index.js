'use strict';

const _ = require('lodash');
const express = require('express');
const routerProxy = require('../../router/proxy');
const route = require('../route');
const apiMiddleware = require('./middleware');
const apiParam = require('./param');

function setupRoutesWithoutAuthentication(router) {
    // Session
    router.post(
        '/sessions',
        apiMiddleware.jsonParser,
        route.session.create
    );
}

function setupRoutesWithRequiredAuthentication(router) {
    // Session
    router.get(
        '/sessions/current',
        route.session.get
    );
    router.delete(
        '/sessions/:sessionId',
        route.session.delete
    );

    // Note
    router.get(
        '/notes',
        route.note.list
    );
    router.post(
        '/notes',
        apiMiddleware.jsonParser,
        route.note.create
    );
    router.get(
        '/notes/:note_id',
        route.note.get
    );
    router.get(
        '/notes/:note_id/version/:version',
        route.note.choose_ver
    );
    router.put(
        '/notes/:note_id',
        apiMiddleware.jsonParser,
        route.note.update
    );
    router.delete(
        '/notes/:note_id',
        route.note.delete
    );
}

function setup(router) {
    router.use(apiMiddleware.startSession);

    _.each(apiParam, (param, name) => {
        router.param(name, param);
    });

    setupRoutesWithoutAuthentication(router);
    router.use(apiMiddleware.checkAuthentication);
    setupRoutesWithRequiredAuthentication(router);
}

module.exports = () => {
    const router = express.Router();
    routerProxy.setup(router, setup, apiMiddleware.errorHandler);
    return router;
};
