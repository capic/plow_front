'use strict';

describe('Service: srviTasksManagement', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var srviTasksManagement;
  beforeEach(inject(function (_srviTasksManagement_) {
    srviTasksManagement = _srviTasksManagement_;
  }));

  it('should do something', function () {
    expect(!!srviTasksManagement).toBe(true);
  });

});
