require('../spec_helper');

describe('Page', function() {
  var DrugLabelApi, searchDeferred, context;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    var Page = require('../../../app/components/page');
    var $application = new Cursor({drugLabels: null, search: null}, jasmine.createSpy('drugLabels'));
    context = withContext({config: {}}, {$application}, function() {
      var {$application} = this.props;
      return (<Page {...{$application}}/>);
    }, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a search drug label', function() {
    expect('.search-drug-label').toExist();
  });

  it('does not render the drug list', function() {
    expect('.drug-labels-list').not.toExist();
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

  describe('when there are results from the search', function() {
    beforeEach(function() {
      var $application = new Cursor({drugLabels: Factory.buildList('drugLabel', 3), search: 'search'});
      context.setProps({$application});
    });

    it('renders the results', function() {
      expect('.drug-labels-list').toExist();
      expect('tbody tr').toHaveLength(3);
    });
  });

  describe('when there are no results from the search', function() {
    beforeEach(function() {
      var $application = new Cursor({drugLabels: [], search: 'search'});
      context.setProps({$application});
    });

    it('renders the results', function() {
      expect('.drug-labels-list').toContainText(`Sorry, there aren't any results for 'search'`);
    });
  });
});