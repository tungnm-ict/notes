'use strict';

angular.module('app').component('login', {
    templateUrl: '/src/login/login.html',
    bindings: {
        session: '<'
    },
    controller: function(Session, $location) {
        this.$onInit = function() {
            if (this.session) {
                $location.path('/');
            }
        };

        this.loginClicked = function() {
            this.error = this._validate();

            if (!this.error) {
                Session.save({
                    name: this.username,
                    password: this.password,
                }).$promise.then(session => {
                    $location.path('/');
                }).catch(reason => {
                    this.error = 'Login failed';
                });
            }
        };

        this._validate = function() {
            if (!this.username) {
                return 'The username is empty';
            }

            if (!this.password) {
                return 'The password is empty';
            }
        };
    },
});
