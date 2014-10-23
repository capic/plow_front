'use strict';

describe('Filter: fltrTime', function () {

  // load the filter's module
  beforeEach(module('plowshareFrontApp'));

  // initialize a new instance of the filter before each test
  var fltrTime;
  beforeEach(inject(function ($filter) {
    fltrTime = $filter('fltrTime');
  }));

  it('should return the input prefixed with "fltrTime filter:"', function () {
    var text = 'angularjs';
    expect(fltrTime(text)).toBe('fltrTime filter: ' + text);
  });

});
