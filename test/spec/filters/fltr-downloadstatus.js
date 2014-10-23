'use strict';

describe('Filter: fltrDownloadStatus', function () {

  // load the filter's module
  beforeEach(module('plowshareFrontApp'));

  // initialize a new instance of the filter before each test
  var fltrDownloadStatus;
  beforeEach(inject(function ($filter) {
    fltrDownloadStatus = $filter('fltrDownloadStatus');
  }));

  it('should return the input prefixed with "fltrDownloadStatus filter:"', function () {
    var text = 'angularjs';
    expect(fltrDownloadStatus(text)).toBe('fltrDownloadStatus filter: ' + text);
  });

});
