'use strict';

describe('Service: actionresource', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var actionresource;
  beforeEach(inject(function (_actionresource_) {
    actionresource = _actionresource_;
  }));

  it('should do something', function () {
    expect(!!actionresource).toBe(true);
  });

});
