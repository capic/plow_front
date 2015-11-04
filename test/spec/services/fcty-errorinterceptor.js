'use strict';

describe('Service: fctyErrorinterceptor', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctyErrorinterceptor;
  beforeEach(inject(function (_fctyErrorinterceptor_) {
    fctyErrorinterceptor = _fctyErrorinterceptor_;
  }));

  it('should do something', function () {
    expect(!!fctyErrorinterceptor).toBe(true);
  });

});
