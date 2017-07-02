'use strict';

const _ = require('lodash');
const fs = require('fs');

const path = 'etc/config.json';

const configs = JSON.parse(fs.readFileSync(path));
let config;

if (process.env.NODE_ENV) {
    const envConfig = configs[process.env.NODE_ENV];

    if (envConfig) {
        config = _.merge(configs.base, envConfig);
    }
    else {
        throw new Error('Unknown NODE_ENV.');
    }
}
else {
    throw new Error('NODE_ENV is not set.');
}

module.exports = config;
