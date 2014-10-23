'use strict';

describe('Filter: fltrBytes', function () {

  // load the filter's module
  beforeEach(module('plowshareFrontApp'));

  // initialize a new instance of the filter before each test
  var fltrBytes;
  beforeEach(inject(function ($filter) {
    fltrBytes = $filter('fltrBytes');
  }));

  it('should return the input prefixed with "fltrBytes filter:"', function () {
    var text = 'angularjs';
    expect(fltrBytes(text)).toBe('fltrBytes filter: ' + text);
  });

});
