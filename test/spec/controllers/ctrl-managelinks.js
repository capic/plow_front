'use strict';

describe('Controller: CtrlManagelinksCtrl', function () {

  // load the controller's module
  beforeEach(module('plowshareFrontApp'));

  var CtrlManagelinksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlManagelinksCtrl = $controller('CtrlManagelinksCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
