'use strict';

describe('noteCreate', function() {
    let $componentController;
    let ctrl;
    let $location;
    let Note;
    let $q;
    let $rootScope;

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
        spyOn(Note, 'save');

        ctrl = $componentController('noteCreate');
    });

    describe('_validate', () => {
        it('should return undefined if data is valid', () => {
            ctrl.subject = 'some subject';
            ctrl.body = 'some body';

            expect(ctrl._validate()).toBeUndefined();
        });

        it('should error if subject is not defined', () => {
            ctrl.subject = null;
            ctrl.body = 'some body';

            expect(ctrl._validate()).toEqual('The subject is empty.');
        });

        it('should error if body is not defined', () => {
            ctrl.subject = 'some subject';
            ctrl.body = null;

            expect(ctrl._validate()).toEqual('The body is empty.');
        });
    });

    describe('createNote', () => {
        it('should save the Note then redirect to / if success', () => {
            Note.save.and.returnValue({
                $promise: $q.when(),
            });

            ctrl.subject = 'some subject';
            ctrl.body = 'some body';

            ctrl.createNote();

            $rootScope.$digest();

            expect(Note.save).toHaveBeenCalledWith({
                subject: 'some subject',
                body: 'some body',
            });

            expect($location.path).toHaveBeenCalledWith('/');
            expect(ctrl.error).toBeUndefined();
        });

        it('should save the Note then set error if failure', () => {
            Note.save.and.returnValue({
                $promise: $q.reject('Error'),
            });

            ctrl.subject = 'some subject';
            ctrl.body = 'some body';

            ctrl.createNote();

            $rootScope.$digest();

            expect(Note.save).toHaveBeenCalledWith({
                subject: 'some subject',
                body: 'some body',
            });

            expect($location.path).not.toHaveBeenCalledWith('/');
            expect(ctrl.error).toEqual('Error occurred while creating a note.');
        });

        it('should do nothing if any validation error', () => {
            ctrl.subject = null;
            ctrl.body = 'some body';

            ctrl.createNote();

            $rootScope.$digest();

            expect(Note.save).not.toHaveBeenCalled();

            expect($location.path).not.toHaveBeenCalledWith('/');
            expect(ctrl.error).toEqual('The subject is empty.');
        });
    });
});
