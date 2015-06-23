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

  it('disables the submit button', function() {
    expect(':submit:disabled').toExist();
  });

  describe('when entering a drug to search and submitting it', function() {
    beforeEach(function() {
      $('.search-drug-label').val('ibuprofen').simulate('change');
    });

    describe('when submitting the search', function() {
      beforeEach(function() {
        $(':submit').simulate('submit');
      });

      it('makes an DrugLabel search api request', function() {
        expect(DrugLabelApi.search).toHaveBeenCalled();
      });
    });
  });

  describe('when there are results from the search', function() {
    var drugLabels;
    beforeEach(function() {
      drugLabels = Factory.buildList('drugLabel', 3);
      var $application = new Cursor({drugLabels, search: 'search'});
      context.setProps({$application});
    });

    it('enables the submit button', function() {
      expect(':submit:disabled').not.toExist();
    });

    it('renders the results', function() {
      expect('.drug-labels-list').toExist();
      expect('.drug-labels-list li').toHaveLength(3);
      expect($('.drug-labels-list li').map(function() { return $(this).text(); }).toArray()).toEqual(drugLabels.map(d => d.openfda.brand_name.join(' ')));
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