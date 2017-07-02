'use strict';

angular.module('app').factory('Note', function($resource) {
    return $resource('/api/notes/:note_id', {}, {
        update: {
            method: 'PUT',
        },
        version: {
            method: 'GET',
            url: '/api/notes/:note_id/version/:version'
        }
    });
});
