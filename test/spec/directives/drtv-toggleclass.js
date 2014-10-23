'use strict';

describe('Directive: drtvToggleClass', function () {

  // load the directive's module
  beforeEach(module('plowshareFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drtv-toggle-class></drtv-toggle-class>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drtvToggleClass directive');
  }));
});
