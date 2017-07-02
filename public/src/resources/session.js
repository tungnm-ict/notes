'use strict';

angular.module('app').factory('Session', function($resource) {
    return $resource('/api/sessions/:id', {}, {
        current: {
            method: 'GET',
            url: '/api/sessions/current'
        }
    });
});
