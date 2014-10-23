'use strict';

describe('Filter: fltrLinkStatus', function () {

  // load the filter's module
  beforeEach(module('plowshareFrontApp'));

  // initialize a new instance of the filter before each test
  var fltrLinkStatus;
  beforeEach(inject(function ($filter) {
    fltrLinkStatus = $filter('fltrLinkStatus');
  }));

  it('should return the input prefixed with "fltrLinkStatus filter:"', function () {
    var text = 'angularjs';
    expect(fltrLinkStatus(text)).toBe('fltrLinkStatus filter: ' + text);
  });

});
