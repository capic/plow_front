'use strict';

describe('Service: fctyActiontyperesource', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctyActiontyperesource;
  beforeEach(inject(function (_fctyActiontyperesource_) {
    fctyActiontyperesource = _fctyActiontyperesource_;
  }));

  it('should do something', function () {
    expect(!!fctyActiontyperesource).toBe(true);
  });

});
