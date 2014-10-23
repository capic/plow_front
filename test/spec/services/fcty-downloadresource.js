'use strict';

describe('Service: fctyDownloadResource', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctyDownloadResource;
  beforeEach(inject(function (_fctyDownloadResource_) {
    fctyDownloadResource = _fctyDownloadResource_;
  }));

  it('should do something', function () {
    expect(!!fctyDownloadResource).toBe(true);
  });

});
