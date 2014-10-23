'use strict';

describe('Controller: CtrlLinkCtrl', function () {

  // load the controller's module
  beforeEach(module('plowshareFrontApp'));

  var CtrlLinkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlLinkCtrl = $controller('CtrlLinkCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
