'use strict';

describe('login', function() {
    let $componentController;
    let ctrl;
    let $location;
    let Session;
    let $q;
    let $rootScope;

    beforeEach(() => {
        module('app');

        inject((_$componentController_, _Session_, _$location_, _$q_, _$rootScope_) => {
            $componentController = _$componentController_;
            Session = _Session_;
            $location = _$location_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        spyOn($location, 'path');
        spyOn(Session, 'save');

        ctrl = $componentController('login');
    });

    describe('$onInit', () => {
        it('should redirect to / if the session is defined', () => {
            ctrl.session = new Session({
                id: 'e3WCf9l8C5oxli4aiH_CdncEaypsD8AW',
                user: {
                    id: 1,
                    name: 'user1'
                }
            });

            ctrl.$onInit();

            expect($location.path).toHaveBeenCalledWith('/');
        });

        it('should not redirect to / if the session is not defined', () => {
            ctrl.session = null;

            ctrl.$onInit();

            expect($location.path).not.toHaveBeenCalled();
        });
    });

    describe('_validate', () => {
        it('should return undefined if data is valid', () => {
            ctrl.username = 'user1';
            ctrl.password = 'password1';

            expect(ctrl._validate()).toBeUndefined();
        });

        it('should error if username is not defined', () => {
            ctrl.username = null;
            ctrl.password = 'password1';

            expect(ctrl._validate()).toEqual('The username is empty');
        });

        it('should error if password is not defined', () => {
            ctrl.username = 'user1';
            ctrl.password = null;

            expect(ctrl._validate()).toEqual('The password is empty');
        });
    });

    describe('loginClicked', () => {
        it('should save the session then redirect to /', () => {
            Session.save.and.returnValue({
                $promise: $q.when(),
            });

            ctrl.username = 'user1';
            ctrl.password = 'password1';

            ctrl.loginClicked();

            $rootScope.$digest();

            expect(Session.save).toHaveBeenCalledWith({
                name: 'user1',
                password: 'password1',
            });

            expect($location.path).toHaveBeenCalledWith('/');
            expect(ctrl.error).toBeUndefined();
        });

        it('should save the session then set error if failure', () => {
            Session.save.and.returnValue({
                $promise: $q.reject('Error'),
            });

            ctrl.username = 'user1';
            ctrl.password = 'password1';

            ctrl.loginClicked();

            $rootScope.$digest();

            expect(Session.save).toHaveBeenCalledWith({
                name: 'user1',
                password: 'password1',
            });

            expect($location.path).not.toHaveBeenCalledWith('/');
            expect(ctrl.error).toEqual('Login failed');
        });

        it('should do nothing if any validation error', () => {
            ctrl.username = null;
            ctrl.password = 'password1';

            ctrl.loginClicked();

            $rootScope.$digest();

            expect(Session.save).not.toHaveBeenCalled();

            expect($location.path).not.toHaveBeenCalledWith('/');
            expect(ctrl.error).toEqual('The username is empty');
        });
    });
});
