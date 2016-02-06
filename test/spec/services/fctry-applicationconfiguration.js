'use strict';

describe('Service: fctryApplicationConfiguration', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctryApplicationConfiguration;
  beforeEach(inject(function (_fctryApplicationConfiguration_) {
    fctryApplicationConfiguration = _fctryApplicationConfiguration_;
  }));

  it('should do something', function () {
    expect(!!fctryApplicationConfiguration).toBe(true);
  });

});
