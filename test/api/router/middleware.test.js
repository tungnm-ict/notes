'use strict';

require('should');
const sinon = require('sinon');
const model = require('../../../src/model');
const middleware = require('../../../src/api/router/middleware');
const ApiError = require('../../../src/api/error');

describe('Tests for api router middleware', function() {
    let req;
    let res;

    beforeEach(() => {
        req = {};

        res = {
            status: sinon.spy(),
            json: sinon.spy(),
        };
    });

    describe('checkAuthentication', () => {
        let userId;

        beforeEach(() => {
            req.session = {};

            return model.sequelize.sync({
                force: true
            }).then(() => {
                return model.User.createUser('user1', 'password1').then(user => {
                    userId = user.id;
                });
            });
        });

        it('should reject AUTHENTICATION_REQUIRED if no session', () => {
            return middleware.checkAuthentication(req, res).should.be.rejectedWith(ApiError.Code.AUTHENTICATION_REQUIRED.name);
        });

        it('should reject AUTHENTICATION_REQUIRED if no user with this id', () => {
            req.session.userId = -1;

            return middleware.checkAuthentication(req, res).should.be.rejectedWith(ApiError.Code.AUTHENTICATION_REQUIRED.name);
        });

        it('should set the user in req if correct user id', () => {
            req.session.userId = userId;

            return middleware.checkAuthentication(req, res).then(() => {
                req.currentUser.id.should.equal(userId);
            });
        });
    });

    describe('errorHandler', () => {
        let next;
        let e;

        beforeEach(() => {
            next = sinon.spy();
        });

        it('should next the error if the headers have already been sent', () => {
            res.headersSent = true;
            e = new Error('Error');

            middleware.errorHandler(e, req, res, next);

            next.calledWithExactly(e).should.be.true();
            res.status.called.should.be.false();
            res.json.called.should.be.false();
        });

        it('should json the error codename with 400 status if instance of BaseError', () => {
            res.headersSent = false;
            e = new ApiError(ApiError.Code.AUTHENTICATION_REQUIRED);

            middleware.errorHandler(e, req, res, next);

            res.status.calledWithExactly(400).should.be.true();
            res.json.calledWithExactly({
                code: ApiError.Code.AUTHENTICATION_REQUIRED.name,
            }).should.be.true();
            next.called.should.be.false();
        });

        it('should json the error codename with 404 status if instance of BaseError', () => {
            res.headersSent = false;
            e = new ApiError(ApiError.Code.SESSION_NOT_FOUND);

            middleware.errorHandler(e, req, res, next);

            res.status.calledWithExactly(404).should.be.true();
            res.json.calledWithExactly({
                code: ApiError.Code.SESSION_NOT_FOUND.name,
            }).should.be.true();
            next.called.should.be.false();
        });

        it('should json error 500 with INTERNAL_SERVER_ERROR for other errors', () => {
            res.headersSent = false;
            e = new Error('Error');

            middleware.errorHandler(e, req, res, next);

            res.status.calledWithExactly(500).should.be.true();
            res.json.calledWithExactly({
                code: ApiError.Code.INTERNAL_SERVER_ERROR.name,
            }).should.be.true();
            next.called.should.be.false();
        });
    });
});
