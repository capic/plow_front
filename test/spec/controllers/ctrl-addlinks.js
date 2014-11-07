'use strict';

describe('Controller: AddLinksCtrl', function () {

  // load the controller's module
  beforeEach(module('plowshareFrontApp'));

  var AddLinksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddLinksCtrl = $controller('AddLinksCtrl', {
      $scope: scope
    });
  }));


  /** TEST FOR backAddLink **/
  it('backAddLink: should decreased the number of links to add', function () {
    scope.nbrLinksToAdd = 2;
    AddLinksCtrl.backAddLink(['http://lien1.fr', ',']);

    expect(scope.nbrLinksToAdd).toEqual(1);
  });

  it('backAddLink: should change the value of the progress bar', function () {
    scope.nbrLinksTotalToAdd = 2;
    scope.nbrLinksToAdd = 2;
    scope.progressbarValue = 0;

    AddLinksCtrl.backAddLink(['http://lien1.fr', ',']);

    expect(scope.progressbarValue).toEqual(50);
  });

  it('backAddLink: should change the value of the progress bar to 0', function () {
    scope.nbrLinksTotalToAdd = 2;
    scope.nbrLinksToAdd = 1;
    scope.progressbarValue = 50;

    AddLinksCtrl.backAddLink(['http://lien1.fr', ',']);

    expect(scope.progressbarValue).toEqual(0);
  });

  it('backAddLink: should change the value of string of the textarea', function () {
    scope.links.linksString = 'http://lien1.fr, http://lien2.fr';

    AddLinksCtrl.backAddLink(['http://lien1.fr', ',']);

    expect(scope.links.linksString).toEqual(' http://lien2.fr');
  });
});
