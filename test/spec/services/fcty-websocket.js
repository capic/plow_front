'use strict';

describe('Service: fctyWebSocket', function () {

  // load the service's module
  beforeEach(module('plowshareFrontApp'));

  // instantiate service
  var fctyWebSocket;
  beforeEach(inject(function (_fctyWebSocket_) {
    fctyWebSocket = _fctyWebSocket_;
  }));

  it('should do something', function () {
    expect(!!fctyWebSocket).toBe(true);
  });

});
