'use strict';

const _ = require('lodash');
const BaseError = require('../baseError');

class DomainError extends BaseError {
    get name() {
        return DomainError.errorName;
    }
}

DomainError.errorName = 'DomainError';

DomainError.Code = _.extend(_.transform([
    'AUTHENTICATION_FAILED',
], (result, code) => {
    result[code] = {
        name: code,
        notFound: false
    };
}), _.transform([
    'USER_NOT_FOUND',
    'NOTE_NOT_FOUND',
], (result, code) => {
    result[code] = {
        name: code,
        notFound: true
    };
}));

module.exports = DomainError;
