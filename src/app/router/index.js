'use strict';

const express = require('express');
const routerProxy = require('../../router/proxy');
const route = require('../route');
const middleware = require('./middleware');

function setup(router) {
    router.get('/', route.index);
}

module.exports = () => {
    const router = express.Router();
    routerProxy.setup(router, setup, middleware.errorHandler);
    return router;
};
