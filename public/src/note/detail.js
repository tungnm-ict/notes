'use strict';

angular.module('app').component('noteDetail', {
    templateUrl: '/src/note/detail.html',
    bindings: {
        session: '<',
        note: '<',
    },
});
