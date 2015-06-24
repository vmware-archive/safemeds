require('../spec_helper');

describe('SearchNewDrug', function() {
  const baseApiUrl = 'http://example.com';
  const searchNew = 'search';
  var subject, callbackSpy;
  beforeEach(function() {
    var SearchNewDrug = require('../../../app/components/search_new_drug');
    callbackSpy = jasmine.createSpy('callback');
    var $application = new Cursor({searchNew, newDrug: null}, callbackSpy);

    var context = withContext({config: {baseApiUrl}}, function() {
      return (<SearchNewDrug {...{$application}} ref="subject"/>);
    }, root);
    subject = context.refs.subject;
  });

  describe('when submitting the search', function() {
    beforeEach(function() {
      spyOn(subject, 'search').and.returnValue(Promise.resolve(searchNew));
      $('.form-inline').simulate('submit');
      MockPromises.executeForResolvedPromises();
    });

    it('updates the cursor', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({searchNew: '', newDrug: searchNew}));
    });
  });
});