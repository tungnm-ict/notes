'use strict';

const _ = require('lodash');
const middleware = require('./middleware');
const wrapper = require('./wrapper');

const httpMethods = ['get', 'post', 'put', 'delete'];

function wrapHttpMethod(router, method) {
    return (...args) => {
        const path = args.shift();
        const route = wrapper.wrapRoute(args.pop());
        args = _.map(args, wrapper.wrap);
        args.unshift(path);
        args.push(route);

        router[method].apply(router, args);
    };
}

function proxyRouter(router) {
    const proxiedRouter = _.transform(httpMethods, (proxiedRouter, httpMethod) => {
        proxiedRouter[httpMethod] = wrapHttpMethod(router, httpMethod);
    }, {});

    proxiedRouter.use = (...args) => {
        let pathOrMiddleware = args.shift();
        if (_.isFunction(pathOrMiddleware)) {
            pathOrMiddleware = wrapper.wrap(pathOrMiddleware);
        }
        args = _.map(args, wrapper.wrap);
        args.unshift(pathOrMiddleware);

        router.use.apply(router, args);
    };

    proxiedRouter.param = (...args) => {
        args[1] = wrapper.wrapParam(args[1]);
        router.param.apply(router, args);
    };

    return proxiedRouter;
}

module.exports = {
    setup: (router, setup, errorHandler) => {
        const proxiedRouter = proxyRouter(router);

        setup(proxiedRouter);

        proxiedRouter.use(middleware.routeNotFound);

        proxiedRouter.use(errorHandler);

        return proxiedRouter;
    }
};
