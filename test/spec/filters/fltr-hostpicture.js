'use strict';

describe('Filter: fltrHostpicture', function () {

  // load the filter's module
  beforeEach(module('plowshareFrontApp'));

  // initialize a new instance of the filter before each test
  var fltrHostpicture;
  beforeEach(inject(function ($filter) {
    fltrHostpicture = $filter('fltrHostpicture');
  }));

  it('should return the input prefixed with "fltrHostpicture filter:"', function () {
    var text = 'angularjs';
    expect(fltrHostpicture(text)).toBe('fltrHostpicture filter: ' + text);
  });

});
