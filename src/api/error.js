'use strict';

const _ = require('lodash');
const BaseError = require('../baseError');

class ApiError extends BaseError {
    get name() {
        return ApiError.errorName;
    }
}

ApiError.errorName = 'ApiError';

ApiError.Code = _.extend(_.transform([
    'AUTHENTICATION_FAILED',
    'AUTHENTICATION_REQUIRED',

    'INTERNAL_SERVER_ERROR',
], (result, code) => {
    result[code] = {
        name: code,
        notFound: false
    };
}), _.transform([
    'SESSION_NOT_FOUND',
], (result, code) => {
    result[code] = {
        name: code,
        notFound: true
    };
}));

module.exports = ApiError;
