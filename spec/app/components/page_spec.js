require('../spec_helper');

describe('Page', function() {
  var DrugLabelApi, searchDeferred;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    var Page = require('../../../app/components/page');
    var $events = new Cursor([], jasmine.createSpy('events'));
    withContext({config: {}}, function() {
      return (<Page {...{$events}}/>);
    }, root);
  });

  it('renders a search drug label', function() {
    expect('.search-drug-label').toExist();
  });

  describe('when entering a drug to search and submitting it', function() {
    beforeEach(function() {
      $('.search-drug-label').val('ibuprofen').simulate('change');
      $(':submit').simulate('submit');
    });

    it('makes an DrugLabel search api request', function() {
      expect(DrugLabelApi.search).toHaveBeenCalled();
    });
  });
});