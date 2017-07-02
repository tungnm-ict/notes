'use strict';

angular.module('app').component('noteCreate', {
    templateUrl: '/src/note/create.html',
    bindings: {
        session: '<',
    },
    controller: function(Note, $location) {
        this.createNote = function() {
            this.error = this._validate();

            if (!this.error) {
                Note.save({
                    subject: this.subject,
                    body: this.body,
                }).$promise.then(() => {
                    $location.path('/');
                }).catch(reason => {
                    this.error = 'Error occurred while creating a note.';
                });
            }
        };

        this._validate = function() {
            if (!this.subject) {
                return 'The subject is empty.';
            }

            if (!this.body) {
                return 'The body is empty.';
            }
        };
    },
});
