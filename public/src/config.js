'use strict';

angular.module('app').config(function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
});
