require('../spec_helper');

describe('Page', function() {
  var DrugLabelApi, searchDeferred, context;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    var Page = require('../../../app/components/page');
    var $drugLabels = new Cursor([], jasmine.createSpy('drugLabels'));
    context = withContext({config: {}}, {$drugLabels}, function() {
      var {$drugLabels} = this.props;
      return (<Page {...{$drugLabels}}/>);
    }, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
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
      expect(DrugLabelApi.search).toHaveBeenCalledWith({name: 'ibuprofen'});
    });
  });

  describe('when there are results from the search', function() {
    beforeEach(function() {
      var $drugLabels = new Cursor(Factory.buildList('drugLabel', 3));
      context.setProps({$drugLabels});
    });

    it('renders the results', function() {
      expect('.table-scrollable-body .table-data tr').toHaveLength(3);
    });
  });
});