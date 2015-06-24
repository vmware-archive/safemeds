require('../spec_helper');

describe('Compare', function() {
  var DrugLabelApi, compareDeferred, searchDeferred, context;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    compareDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    spyOn(DrugLabelApi, 'compareDrugs').and.returnValue(compareDeferred.promise());
    var Compare = require('../../../app/components/compare');
    var $application = new Cursor({page: 'compare', existingDrugs: [], newDrug: '', search: null}, jasmine.createSpy('drugLabels'));
    context = withContext({config: {}}, {$application}, function() {
      var {$application} = this.props;
      return (<Compare {...{$application}}/>);
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
    expect('button:contains("Find")').not.toExist();
  });

  it('does not render a new drug', function() {
    expect('.new-drug').not.toExist();
  });

  it('does not enable the view side effects button', function() {
    expect('.view-side-effects:disabled').toExist();
  });

  describe('when there is search', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'compare', existingDrugs: ['ibuprofen'], newDrug: '', search: 'ibuprofen'}, jasmine.createSpy('callback'));
      context.setProps({$application});
    });

    it('renders the submit button', function() {
      expect('button:contains("Find")').toExist();
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

  describe('when there are existing drugs', function() {
    var callbackSpy;
    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      var $application = new Cursor({page: 'compare', existingDrugs: ['ibuprofen', 'claritin'], search: 'ibuprofen'}, callbackSpy);
      context.setProps({$application});
    });

    it('renders the results', function() {
      expect('.existing-drugs-list').toExist();
      expect('.existing-drugs-list').toContainText('ibuprofen');
      expect('.existing-drugs-list').toContainText('claritin');
    });

    describe('when clicking on the delete link', function() {
      beforeEach(function() {
        $('.existing-drugs-list li:eq(1) .delete').simulate('click');
      });

      it('removes that drug', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({existingDrugs: ['ibuprofen']}));
      });
    });
  });

  describe('when there is a new drug', function() {
    var callbackSpy;
    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      var $application = new Cursor({page: 'compare', existingDrugs: ['ibuprofen'], newDrug: 'claritin', search: 'ibuprofen'}, callbackSpy);
      context.setProps({$application});
    });

    it('renders a new drug', function() {
      expect('.new-drug').toExist();
    });

    describe('when clicking on the delete link', function() {
      beforeEach(function() {
        $('.new-drug .delete').simulate('click');
      });

      it('removes that drug', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({newDrug: null}));
      });
    });
  });

  describe('when there are existing drugs and a new drug', function() {
    const newDrug = 'claritin';
    const existingDrugs = ['ibuprofen', 'advil'];

    var callbackSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      var $application = new Cursor({page: 'compare', existingDrugs, newDrug, search: ''}, callbackSpy);
      context.setProps({$application});
    });

    it('enable the view side effects button', function() {
      expect('.view-side-effects:disabled').not.toExist();
    });

    describe('when the user clicks "View Side Effects"', function() {
      beforeEach(function() {
        $('.view-side-effects').simulate('click');
      });

      it('makes a request to the compare api', function() {
        expect(DrugLabelApi.compareDrugs).toHaveBeenCalledWith('claritin', ['ibuprofen', 'advil']);
      });

      describe('when the compare api is successful with no interactions', function() {
        describe('when there are interactions', function() {
          var interactions;
          beforeEach(function() {
            interactions = {
              [existingDrugs[0]]: {
                newDrug: {
                  drug_interactions: ['drug2 is fatal'],
                  warnings: ['drug2 may cause death, take with caution']
                }
              }
            };
            compareDeferred.resolve(interactions);
          });

          it('sets the modal with the interactions', function() {
            expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({modal: {interactions: true}}));
          });
        });

        describe('when there are no interactions', function() {
          const interactions = {};
          beforeEach(function() {
            compareDeferred.resolve(interactions);
          });

          it('sets the modal with an empty hash', function() {
            expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({modal: {interactions: false}}));
          });
        });
      });
    });
  });
});