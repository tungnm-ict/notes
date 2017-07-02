'use strict';

const _ = require('lodash');
const glob = require('glob');
const path = require('path');

function getFilesInModule(dirname) {
    return _.map(glob.sync(dirname + '/*.js'), file => {
        return path.basename(file, '.js');
    });
}

function loadModules(dirname) {
    return _.chain(getFilesInModule(dirname))
        .reject('index')
        .transform((modules, name) => {
            modules[name] = require(dirname + '/' + name);
        }, {})
        .value();
}

module.exports = {
    loadModules,
};
