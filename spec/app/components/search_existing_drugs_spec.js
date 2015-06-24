require('../spec_helper');

describe('SearchExistingDrugs', function() {
  const baseApiUrl = 'http://example.com';
  const search = 'search';
  var subject, callbackSpy;
  beforeEach(function() {
    var SearchExistingDrugs = require('../../../app/components/search_existing_drugs');
    callbackSpy = jasmine.createSpy('callback');
    var $application = new Cursor({search, existingDrugs: []}, callbackSpy);

    var context = withContext({config: {baseApiUrl}}, function() {
      return (<SearchExistingDrugs {...{$application}} ref="subject"/>);
    }, root);
    subject = context.refs.subject;
  });

  describe('when submitting the search', function() {
    beforeEach(function() {
      spyOn(subject, 'search').and.returnValue(Promise.resolve(search));
      $('.form-inline').simulate('submit');
      MockPromises.executeForResolvedPromises();
    });

    it('updates the cursor', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({search: '', existingDrugs: [search]}));
    });
  });
});