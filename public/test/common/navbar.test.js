'use strict';

describe('navbar', function() {
    let $componentController;
    let ctrl;
    let $rootScope;
    let Session;
    let $location;
    let $q;

    beforeEach(() => {
        module('app');

        inject((_$componentController_, _$rootScope_, _Session_, _$location_, _$q_) => {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            Session = _Session_;
            $location = _$location_;
            $q = _$q_;
        });

        spyOn(Session, 'remove');
        spyOn($location, 'path');

        ctrl = $componentController('navbar');
    });

    describe('$onInit', () => {
        it('should define the avatar url if session is defined', () => {
            ctrl.session = new Session({
                id: 'e3WCf9l8C5oxli4aiH_CdncEaypsD8AW',
                user: {
                    id: 1,
                    name: 'user1'
                }
            });

            ctrl.$onInit();

            expect(ctrl.userAvatarUrl).toEqual('/img/user1.jpg');
        });

        it('should not define the avatar url if session is not defined', () => {
            ctrl.session = null;

            ctrl.$onInit();

            expect(ctrl.userAvatarUrl).toBeUndefined();
        });
    });

    describe('logoutClicked', () => {
        it('should remove the Session then redirect to the login page if success', () => {
            Session.remove.and.returnValue({
                $promise: $q.when(),
            });

            ctrl.session = new Session({
                id: 'e3WCf9l8C5oxli4aiH_CdncEaypsD8AW',
                user: {
                    id: 1,
                    name: 'user1'
                }
            });

            ctrl.logoutClicked();

            $rootScope.$digest();

            expect(Session.remove).toHaveBeenCalledWith({
                id: 'e3WCf9l8C5oxli4aiH_CdncEaypsD8AW'
            });
            expect($location.path).toHaveBeenCalledWith('/login');
        });

        it('should remove the Session then redirect to the login page if failure', () => {
            Session.remove.and.returnValue({
                $promise: $q.reject('Error'),
            });

            ctrl.session = new Session({
                id: 'e3WCf9l8C5oxli4aiH_CdncEaypsD8AW',
                user: {
                    id: 1,
                    name: 'user1'
                }
            });

            ctrl.logoutClicked();

            $rootScope.$digest();

            expect(Session.remove).toHaveBeenCalledWith({
                id: 'e3WCf9l8C5oxli4aiH_CdncEaypsD8AW'
            });
            expect($location.path).toHaveBeenCalledWith('/login');
        });
    });
});
