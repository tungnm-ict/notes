'use strict';

describe('routes', function() {
    let $q;
    let $rootScope;
    let $route;
    let $location;
    let Session;
    let Note;
    let path;

    beforeEach(() => {
        module('app');

        inject((_$q_, _$rootScope_, _$route_, _$location_, _Session_, _Note_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $route = _$route_;
            $location = _$location_;
            Session = _Session_;
            Note = _Note_;
        });

        spyOn(Session, 'current');
        spyOn(Note, 'query');
        spyOn(Note, 'get');
    });

    function resolveCurrentSession(done) {
        Session.current.and.returnValue({
            $promise: $q.when('session'),
        });

        $route.current.resolve.session(Session).then(session => {
            expect(session).toEqual('session');
            done();
        }).catch(reason => {
            fail(`Should not reject: ${ reason }`);
            done();
        });

        $rootScope.$digest();
    }

    function resolveNoCurrentSession(done) {
        Session.current.and.returnValue({
            $promise: $q.reject(),
        });

        $route.current.resolve.session(Session).then(session => {
            expect(session).toBeUndefined();
            done();
        }).catch(reason => {
            fail(`Should not reject: ${ reason }`);
            done();
        });

        $rootScope.$digest();
    }

    function rejectNoCurrentSession(done) {
        Session.current.and.returnValue({
            $promise: $q.reject(),
        });

        $route.current.resolve.session(Session).then(() => {
            fail(`Should not fulfill`);
            done();
        }).catch(done);

        $rootScope.$digest();
    }

    function resolveNotes(done) {
        Note.query.and.returnValue({
            $promise: $q.when('notes'),
        });

        $route.current.resolve.notes(Note).then(notes => {
            expect(notes).toEqual('notes');

            done();
        }).catch(reason => {
            fail(`Should not reject: ${ reason }`);
            done();
        });

        $rootScope.$digest();
    }

    function resolveNote(done) {
        Note.get.and.returnValue({
            $promise: $q.when('note'),
        });

        $route.current.resolve.note(Note, $route).then(notes => {
            expect(notes).toEqual('note');
            expect(Note.get).toHaveBeenCalledWith({
                id: ':noteId'
            });

            done();
        }).catch(reason => {
            fail(`Should not reject: ${ reason }`);
            done();
        });

        $rootScope.$digest();
    }

    describe('loginPage', () => {
        beforeEach(() => {
            path = '/login';
        });

        it('should resolve when current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveCurrentSession(done);
        });

        it('should resolve when no current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveNoCurrentSession(done);
        });
    });

    describe('noteListPage', () => {
        beforeEach(() => {
            path = '/';
        });

        it('should resolve when current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveCurrentSession(done);
        });

        it('should reject if no current session', done => {
            $location.path(path);

            $rootScope.$digest();

            rejectNoCurrentSession(done);
        });

        it('should resolve notes', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveNotes(done);
        });
    });

    describe('noteCreatePage', () => {
        beforeEach(() => {
            path = '/notes/create';
        });

        it('should resolve when current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveCurrentSession(done);
        });

        it('should reject if no current session', done => {
            $location.path(path);

            $rootScope.$digest();

            rejectNoCurrentSession(done);
        });
    });

    describe('noteDetailPage', () => {
        beforeEach(() => {
            path = '/notes/:noteId';
        });

        it('should resolve when current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveCurrentSession(done);
        });

        it('should reject if no current session', done => {
            $location.path(path);

            $rootScope.$digest();

            rejectNoCurrentSession(done);
        });

        it('should resolve note', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveNote(done);
        });
    });

    describe('noteEditPage', () => {
        beforeEach(() => {
            path = '/notes/:noteId/edit';
        });

        it('should resolve when current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveCurrentSession(done);
        });

        it('should reject if no current session', done => {
            $location.path(path);

            $rootScope.$digest();

            rejectNoCurrentSession(done);
        });

        it('should resolve note', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveNote(done);
        });
    });

    describe('errorPage', () => {
        beforeEach(() => {
            path = '/error';
        });

        it('should resolve when current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveCurrentSession(done);
        });

        it('should resolve if no current session', done => {
            $location.path(path);

            $rootScope.$digest();

            resolveNoCurrentSession(done);
        });

        it('should be called when wrong path', () => {
            $location.path('wrong path');

            $rootScope.$digest();

            expect($route.current.originalPath).toEqual(path);
        });
    });
});
