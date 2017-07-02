'use strict';

angular.module('app').component('noteList', {
    templateUrl: '/src/note/list.html',
    bindings: {
        session: '<',
        notes: '<',
    },
    controller: function(Note, $route) {
        this.$onInit = function() {
            this.hasNotes = !_.isEmpty(this.notes);
        };

        this.deleteNote = function(note) {
            this.error = null;

            Note.delete({
                id: note.id
            }).$promise.then(() => {
                $route.reload();
            }).catch(reason => {
                this.error = 'Error occurred while deleting the note.';
            });
        };
    },
});
