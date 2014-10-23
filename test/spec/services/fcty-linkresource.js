'use strict';

describe('Service: fctyLinkResource', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctyLinkResource;
  beforeEach(inject(function (_fctyLinkResource_) {
    fctyLinkResource = _fctyLinkResource_;
  }));

  it('should do something', function () {
    expect(!!fctyLinkResource).toBe(true);
  });

});
