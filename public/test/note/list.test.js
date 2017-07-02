'use strict';

describe('noteList', function() {
    let $componentController;
    let ctrl;
    let $route;
    let Note;
    let $q;
    let $rootScope;
    let notes;

    beforeEach(() => {
        module('app');

        inject((_$componentController_, _Note_, _$route_, _$q_, _$rootScope_) => {
            $componentController = _$componentController_;
            Note = _Note_;
            $route = _$route_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        spyOn($route, 'reload');
        spyOn(Note, 'delete');

        notes = [
            new Note({
                id: 56,
                subject: 'some subject',
                body: 'some body',
            }),
            new Note({
                id: 57,
                subject: 'another subject',
                body: 'another body',
            }),
        ];

        ctrl = $componentController('noteList', {}, {
            notes
        });
    });


    describe('$onInit', () => {
        it('should set hasNotes to true if notes', () => {
            ctrl.$onInit();

            expect(ctrl.hasNotes).toBeTruthy();
        });

        it('should set hasNotes to false if empty notes', () => {
            ctrl.notes = [];

            ctrl.$onInit();

            expect(ctrl.hasNotes).toBeFalsy();
        });
    });

    describe('deleteNote', () => {
        it('should delete the Note then reload the page if success', () => {
            Note.delete.and.returnValue({
                $promise: $q.when(),
            });

            ctrl.deleteNote(notes[0]);

            $rootScope.$digest();

            expect(Note.delete).toHaveBeenCalledWith({
                id: 56,
            });

            expect($route.reload).toHaveBeenCalled();
            expect(ctrl.error).toBeNull();
        });

        it('should delete the Note then set error if failure', () => {
            Note.delete.and.returnValue({
                $promise: $q.reject('Error'),
            });

            ctrl.deleteNote(notes[0]);

            $rootScope.$digest();

            expect(Note.delete).toHaveBeenCalledWith({
                id: 56,
            });

            expect($route.reload).not.toHaveBeenCalled();
            expect(ctrl.error).toEqual('Error occurred while deleting the note.');
        });
    });
});
