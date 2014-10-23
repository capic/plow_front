'use strict';

describe('Service: srviEventDownloadsLinks', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var srviEventDownloadsLinks;
  beforeEach(inject(function (_srviEventDownloadsLinks_) {
    srviEventDownloadsLinks = _srviEventDownloadsLinks_;
  }));

  it('should do something', function () {
    expect(!!srviEventDownloadsLinks).toBe(true);
  });

});
