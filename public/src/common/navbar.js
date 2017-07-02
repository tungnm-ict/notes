'use strict';

angular.module('app').component('navbar', {
    templateUrl: '/src/common/navbar.html',
    bindings: {
        session: '<',
    },
    controller: function(Session, $location) {
        this.$onInit = function() {
            if (this.session) {
                this.userAvatarUrl = `/img/${ this.session.user.name }.jpg`;
            }
        };

        this.logoutClicked = function() {
            Session.remove({
                id: this.session.id
            }).$promise.then(() => {
                $location.path('/login');
            }).catch(reason => {
                $location.path('/login');
            });
        };
    },
});
