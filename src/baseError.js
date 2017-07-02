'use strict';

class BaseError extends Error {
    constructor(code) {
        super();

        this._code = code;
    }

    get name() {
        throw new Error('This getter must be overridden.');
    }

    get message() {
        return this._code.name;
    }

    get code() {
        return this._code;
    }

    get codeName() {
        return this._code.name;
    }

    get notFound() {
        return this._code.notFound;
    }
}

module.exports = BaseError;
