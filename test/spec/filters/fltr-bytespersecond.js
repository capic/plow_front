'use strict';

describe('Filter: fltrBytesPerSecond', function () {

  // load the filter's module
  beforeEach(module('plowshareFrontApp'));

  // initialize a new instance of the filter before each test
  var fltrBytesPerSecond;
  beforeEach(inject(function ($filter) {
    fltrBytesPerSecond = $filter('fltrBytesPerSecond');
  }));

  it('should return the input prefixed with "fltrBytesPerSecond filter:"', function () {
    var text = 'angularjs';
    expect(fltrBytesPerSecond(text)).toBe('fltrBytesPerSecond filter: ' + text);
  });

});
