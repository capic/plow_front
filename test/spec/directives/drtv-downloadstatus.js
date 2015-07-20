'use strict';

describe('Directive: drtvDownloadstatus', function () {

  // load the directive's module
  beforeEach(module('plowshareFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drtv-downloadstatus></drtv-downloadstatus>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drtvDownloadstatus directive');
  }));
});
