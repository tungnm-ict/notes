'use strict';

describe('error', function() {
    let $componentController;
    let ctrl;
    let $routeParams;

    beforeEach(() => {
        module('app');

        inject((_$componentController_) => {
            $componentController = _$componentController_;
        });

        $routeParams = {
            statusCode: 400,
        };

        ctrl = $componentController('error', {
            $routeParams
        });
    });

    describe('$onInit', () => {
        it('should define errorStatusCode from $routeParams', () => {
            ctrl.$onInit();

            expect(ctrl.errorStatusCode).toEqual(400);
        });
    });
});
