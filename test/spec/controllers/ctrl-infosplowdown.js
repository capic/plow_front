'use strict';

describe('Controller: CtrlInfosplowdownctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('plowshareFrontApp'));

  var CtrlInfosplowdownctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlInfosplowdownctrlCtrl = $controller('CtrlInfosplowdownctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
