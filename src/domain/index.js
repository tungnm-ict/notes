'use strict';

const _ = require('lodash');
const u = require('../util');

_.transform(u.loadModules(__dirname), (modules, module, name) => {
    modules[_.upperFirst(name)] = module;
}, module.exports);
