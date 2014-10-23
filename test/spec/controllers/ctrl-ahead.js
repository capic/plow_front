'use strict';

describe('Controller: CtrlAheadCtrl', function () {

  // load the controller's module
  beforeEach(module('plowshareFrontApp'));

  var CtrlAheadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlAheadCtrl = $controller('CtrlAheadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
