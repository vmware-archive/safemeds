require('../spec_helper');

describe('Page', function() {
  var DrugLabelApi, searchDeferred, context;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    var Page = require('../../../app/components/page');
    var $application = new Cursor({page: 'compare', existingDrugs: [], search: null}, jasmine.createSpy('drugLabels'));
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

  it('renders the drug list', function() {
    expect('.existing-drugs-list').toExist();
  });

  it('does not render the submit button', function() {
    expect(':submit').not.toExist();
  });

  it('does not render a new drug', function() {
    expect('.new-drug').not.toExist();
  });

  describe('when there is search', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'compare', existingDrugs: ['ibuprofen'], search: 'ibuprofen'}, jasmine.createSpy('callback'));
      context.setProps({$application});
    });

    it('enables the submit button', function() {
      expect(':submit:disabled').not.toExist();
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

  describe('when there are drug labels', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'compare', existingDrugs: ['ibuprofen'], search: 'ibuprofen'}, jasmine.createSpy('callback'));
      context.setProps({$application});
    });

    it('renders the results', function() {
      expect('.existing-drugs-list').toExist();
      expect('.existing-drugs-list').toContainText('ibuprofen');
    });
  });

  describe('when there is a new drug', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'compare', existingDrugs: ['ibuprofen'], newDrug: 'claritin', search: 'ibuprofen'}, jasmine.createSpy('callback'));
      context.setProps({$application});
    });

    it('renders a new drug', function() {
      expect('.new-drug').toExist();
    });
  });
});