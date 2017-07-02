'use strict';

angular.module('app').factory('Note', function($resource) {
    return $resource('/api/notes/:id', {}, {
        update: {
            method: 'PUT',
        },
    });
});
