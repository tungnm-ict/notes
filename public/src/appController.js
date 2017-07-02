'use strict';

angular.module('app').controller('appController', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {
        const status = _.get(rejection, 'status');
        const code = _.get(rejection, 'data.code');

        if (status === 400 &&
            code === 'AUTHENTICATION_REQUIRED') {
            $location.path('/login');
        }
        else {
            $location.path('/error');
            $location.search('statusCode', status);
        }
    });
});
