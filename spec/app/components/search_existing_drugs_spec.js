require('../spec_helper');

describe('SearchExistingDrugs', function() {
  const baseApiUrl = 'http://example.com';
  const search = 'search';
  const existingDrugs = ['ibuprofen'];
  var subject, callbackSpy, context;
  const errors = {existingDrugs: null, newDrug: null};
  beforeEach(function() {
    var SearchExistingDrugs = require('../../../app/components/search_existing_drugs');
    callbackSpy = jasmine.createSpy('callback');
    var $application = new Cursor({search, existingDrugs, errors}, callbackSpy);

    context = withContext({config: {baseApiUrl}}, {$application}, function() {
      var {$application} = this.props;
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
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({search: '', existingDrugs: [existingDrugs[0], search]}));
    });
  });

  describe('when adding a drug that is already in the list', function(){
    beforeEach(function() {
      spyOn(subject, 'search').and.returnValue(Promise.resolve(existingDrugs[0]));
      $('.form-inline').simulate('submit');
      MockPromises.executeForResolvedPromises();
    });

    it('updates the cursor with an error', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({errors: {existingDrugs: jasmine.any(String), newDrug: null}}));
    });
  });

  describe('when there are already 5 drugs in the list', function() {
    const existingDrugs = ['ibuprofen', 'water', 'coffee', 'morphine', 'claritin'];
    beforeEach(function() {
      var $application = new Cursor({search, existingDrugs, errors}, callbackSpy);
      context.setProps({$application});
    });

    describe('when adding another drug', function() {
      beforeEach(function() {
        spyOn(subject, 'search').and.returnValue(Promise.resolve('prozac'));
        $('.form-inline').simulate('submit');
        MockPromises.executeForResolvedPromises();
      });

      it('updates the cursor with an error', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({errors: {existingDrugs: jasmine.any(String), newDrug: null}}));
      });
    });
  });
});