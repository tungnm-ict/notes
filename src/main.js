'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const swig = require('swig');
const apiRouter = require('./api/router');
const appRouter = require('./app/router');
const config = require('./config');

const app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve('./src/app/views'));
app.set('view cache', false);

swig.setDefaults({
    cache: false
});

app.use('/api', apiRouter());

const staticRouter = express.static(path.resolve('./public'), {
    maxAge: '1h'
});
app.use(staticRouter);

app.use('/', appRouter());

const httpServer = http.createServer(app);

httpServer.listen(config.port);
