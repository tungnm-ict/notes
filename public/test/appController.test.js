'use strict';

describe('appController', function() {
    let $controller;
    let ctrl;
    let $rootScope;
    let $location;

    beforeEach(() => {
        module('app');

        inject((_$controller_, _$rootScope_, _$location_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $location = _$location_;
        });

        spyOn($location, 'path');
        spyOn($location, 'search');

        ctrl = $controller('appController', {
            $rootScope,
            $location,
        });
    });

    describe('on $routeChangeError', () => {
        let rejection;

        it('should redirect to login if 400 authentication error', () => {
            rejection = {
                status: 400,
                data: {
                    code: 'AUTHENTICATION_REQUIRED'
                }
            };

            $rootScope.$broadcast('$routeChangeError', null, null, rejection);

            expect($location.path).toHaveBeenCalledWith('/login');
        });

        it('should redirect to /error if other rejection status', () => {
            rejection = {
                status: 404
            };

            $rootScope.$broadcast('$routeChangeError', null, null, rejection);

            expect($location.path).toHaveBeenCalledWith('/error');
        });

        it('should redirect to /error if no rejection', () => {
            rejection = null;

            $rootScope.$broadcast('$routeChangeError', null, null, rejection);

            expect($location.path).toHaveBeenCalledWith('/error');
        });
    });
});
