'use strict';

describe('noteDetail', function() {
    let $componentController;
    let ctrl;
    let $location;
    let Note;
    let $q;
    let $rootScope;
    let note;
    // let note_ver2;

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
        spyOn(Note, 'version');

        note = new Note({
            id: 56,
            note_id: '12bf6db0-60b2-11e7-837c-b3afc3bbc126',
            subject: 'some subject',
            body: 'some body',
            version: 2,
            total_version: 2,
        });

        ctrl = $componentController('noteDetail', {}, {
            note
        });
    });

    describe('$onInit', () => {
        it('should set version to note.version', () => {
            ctrl.$onInit();

            expect(ctrl.version).toEqual(note.version);
        });

        it('should set ver_list from 1 to note.version', () => {

            ctrl.$onInit();

            expect(ctrl.ver_list).toEqual([2,1]);
        });
    });

    describe('changeVersion', () => {
        it('should change version the Note then redirect to note detail page if success', () => {
            Note.version.and.returnValue({
                $promise: $q.when(),
            });
            ctrl.version = 2;
            ctrl.changeVersion();

            $rootScope.$digest();

            expect(Note.version).toHaveBeenCalledWith({
                note_id: note.note_id,
                version: ctrl.version,
            });

            expect(ctrl.error).toBeUndefined();
        });

        it('should change version the Note then set error if success', () => {
            Note.version.and.returnValue({
                $promise: $q.reject('Error'),
            });
            ctrl.version = 2;
            ctrl.changeVersion();

            $rootScope.$digest();

            expect(Note.version).toHaveBeenCalledWith({
                note_id: note.note_id,
                version: ctrl.version,
            });

            expect(ctrl.error).toEqual('Error occurred while get version the note.');
        });
    });
});
