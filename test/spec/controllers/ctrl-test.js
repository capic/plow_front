'use strict';

describe('Controller: CtrlTestCtrl', function () {

  // load the controller's module
  beforeEach(module('plowshareFrontApp'));

  var CtrlTestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlTestCtrl = $controller('CtrlTestCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
