'use strict';

const _ = require('lodash');
const BaseError = require('../baseError');

class RouterError extends BaseError {
    get name() {
        return RouterError.errorName;
    }
}

RouterError.errorName = 'RouterError';

RouterError.Code = _.transform([
    'NOT_FOUND',
], (result, code) => {
    result[code] = {
        name: code,
        notFound: true
    };
});

module.exports = RouterError;
