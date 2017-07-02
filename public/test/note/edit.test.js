'use strict';

describe('noteEdit', function() {
    let $componentController;
    let ctrl;
    let $location;
    let Note;
    let $q;
    let $rootScope;
    let note;

    beforeEach(() => {
        module('app');

        inject((_$componentController_, _Note_, _$location_, _$q_, _$rootScope_) => {
            $componentController = _$componentController_;
            Note = _Note_;
            $location = _$location_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        spyOn($location, 'path');
        spyOn(Note, 'update');

        note = new Note({
            id: 56,
            subject: 'some subject',
            body: 'some body',
        });

        ctrl = $componentController('noteEdit', {}, {
            note
        });
    });

    describe('_validate', () => {
        it('should return undefined if data is valid', () => {
            ctrl.note.body = 'new body';

            expect(ctrl._validate()).toBeUndefined();
        });

        it('should error if body is not defined', () => {
            ctrl.note.body = null;

            expect(ctrl._validate()).toEqual('The body is empty.');
        });
    });

    describe('updateNote', () => {
        it('should update the Note then redirect to note detail page if success', () => {
            Note.update.and.returnValue({
                $promise: $q.when(),
            });

            ctrl.note.body = 'new body';

            ctrl.updateNote();

            $rootScope.$digest();

            expect(Note.update).toHaveBeenCalledWith({
                id: 56,
            }, {
                body: 'new body',
            });

            expect($location.path).toHaveBeenCalledWith('/notes/56');
            expect(ctrl.error).toBeUndefined();
        });

        it('should update the Note then set error if success', () => {
            Note.update.and.returnValue({
                $promise: $q.reject('Error'),
            });

            ctrl.note.body = 'new body';

            ctrl.updateNote();

            $rootScope.$digest();

            expect(Note.update).toHaveBeenCalledWith({
                id: 56,
            }, {
                body: 'new body',
            });

            expect($location.path).not.toHaveBeenCalledWith('/notes/56');
            expect(ctrl.error).toEqual('Error occurred while updating the note.');
        });

        it('should do nothing if any validation error', () => {
            ctrl.note.body = null;

            ctrl.updateNote();

            $rootScope.$digest();

            expect(Note.update).not.toHaveBeenCalled();

            expect($location.path).not.toHaveBeenCalledWith('/notes/56');
            expect(ctrl.error).toEqual('The body is empty.');
        });
    });
});
