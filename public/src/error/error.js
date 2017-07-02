'use strict';

angular.module('app').component('error', {
    templateUrl: '/src/error/error.html',
    bindings: {
        session: '<'
    },
    controller: function($routeParams) {
        this.$onInit = function() {
            this.errorStatusCode = $routeParams.statusCode;
        };
    }
});
