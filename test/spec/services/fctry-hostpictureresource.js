'use strict';

describe('Service: fctryHostpictureresource', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctryHostpictureresource;
  beforeEach(inject(function (_fctryHostpictureresource_) {
    fctryHostpictureresource = _fctryHostpictureresource_;
  }));

  it('should do something', function () {
    expect(!!fctryHostpictureresource).toBe(true);
  });

});
