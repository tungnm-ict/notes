'use strict';

angular.module('app').component('noteEdit', {
    templateUrl: '/src/note/edit.html',
    bindings: {
        session: '<',
        note: '<',
    },
    controller: function(Note, $location) {
        this.updateNote = function() {
            this.error = this._validate();

            if (!this.error) {
                Note.update({
                    id: this.note.id
                }, {
                    body: this.note.body
                }).$promise.then(() => {
                    $location.path(`/notes/${ this.note.id }`);
                }).catch(reason => {
                    this.error = 'Error occurred while updating the note.';
                });
            }
        };

        this._validate = function() {
            if (!this.note.body) {
                return 'The body is empty.';
            }
        };
    },
});
