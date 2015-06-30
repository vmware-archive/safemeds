require('../spec_helper');

describe('Compare', function() {
  const errors = {existingDrugs: null, newDrug: null};
  var DrugLabelApi, compareDeferred, searchDeferred, context, cursorSpy;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    compareDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    spyOn(DrugLabelApi, 'compareDrugs').and.returnValue(compareDeferred.promise());
    var Compare = require('../../../app/components/compare');
    cursorSpy = jasmine.createSpy('cursor');
    var $application = new Cursor({page: 'compare', existingDrugs: [], newDrug: '', search: null, sideEffects: {}, errors}, cursorSpy);
    context = withContext({config: {}}, {$application}, function() {
      var {$application} = this.props;
      return (<Compare {...{$application}}/>);
    }, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a search input', function() {
    expect('.search-input').toExist();
  });

  it('renders the drug list', function() {
    expect('.existing-drugs-list').toExist();
  });

  it('disables the add buttons', function() {
    expect('.search-new-drug button').toHaveAttr('disabled');
    expect('.search-existing-drug button').toHaveAttr('disabled');
  });

  it('does not render a new drug', function() {
    expect('.new-drug').not.toExist();
  });

  it('does not enable the view side effects button', function() {
    expect('.view-side-effects:disabled').toExist();
  });

  it('has the correct label text above the input fields', function() {
    expect('.search-existing-drug label').toContainText(`I'm currently taking:`);
    expect('.search-new-drug label').toContainText(`I'm about to take:`);
  });

  it('has the correct placeholder text in the input fields', function() {
    expect('.search-existing-drug input').toHaveAttr('placeholder', 'ex. Ambien');
    expect('.search-new-drug input').toHaveAttr('placeholder', 'ex. Sudafed');
  });

  describe('when there is a search for a new drug', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'compare', existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}], newDrug: null, search: '', searchNew: 'advil', errors}, cursorSpy);
      context.setProps({$application});
    });

    it('enables the add button', function() {
      expect('.search-new-drug button').not.toHaveAttr('disabled');
    });

    describe('when submitting the search', function() {
      beforeEach(function() {
        $('.search-new-drug button').simulate('submit');
      });

      it('makes an DrugLabel search api request', function() {
        expect(DrugLabelApi.search).toHaveBeenCalled();
      });

      it('disables the add button', function() {
        expect('.search-new-drug button').not.toExist();
      });

      it('shows a spinner', function() {
        expect('.search-new-drug .circle-spinner').toExist();
      });

      describe('when the search does not find anything', function() {
        beforeEach(function() {
          searchDeferred.reject();
          MockPromises.executeForResolvedPromises();
        });

        it('makes the error', function() {
          expect(cursorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            errors: {newDrug: jasmine.any(String), existingDrugs: null}
          }));
        });

        it('re-enables the add button', function() {
          expect('.search-new-drug button').not.toHaveAttr('disabled');
        });
      });

      describe('when the search does find something', function() {
        beforeEach(function() {
          searchDeferred.resolve();
          MockPromises.executeForResolvedPromises();
        });

        it('re-enables the add button', function() {
          expect('.search-new-drug button').not.toHaveAttr('disabled');
        });

        it('hides the spinner', function() {
          expect('.search-new-drug .circle-spinner').not.toExist();
        });
      });
    });
  });

  describe('when there is a search for an existing drug', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'compare', existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}], newDrug: null, search: 'advil', searchNew: '', errors}, cursorSpy);
      context.setProps({$application});
    });

    it('enables the add button', function() {
      expect('.search-existing-drug button').not.toHaveAttr('disabled');
    });

    describe('when submitting the search', function() {
      beforeEach(function() {
        $('.search-existing-drug button').simulate('submit');
      });

      it('makes an DrugLabel search api request', function() {
        expect(DrugLabelApi.search).toHaveBeenCalled();
      });

      it('removes the add button and shows the spinner', function() {
        expect('.search-existing-drug button').not.toExist();
        expect('.search-existing-drug .circle-spinner').toExist();
      });

      describe('when the search does not find anything', function() {
        beforeEach(function() {
          searchDeferred.reject();
          MockPromises.executeForResolvedPromises();
        });

        it('makes the error', function() {
          expect(cursorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            errors: {newDrug: null, existingDrugs: jasmine.any(String)}
          }));
        });

        it('re-enables the add button', function() {
          expect('.search-existing-drug button').not.toHaveAttr('disabled');
        });
      });

      describe('when the search does find something', function() {
        beforeEach(function() {
          searchDeferred.resolve();
          MockPromises.executeForResolvedPromises();
        });

        it('re-enables the add button', function() {
          expect('.search-existing-drug button').not.toHaveAttr('disabled');
        });
      });
    });
  });

  describe('when the search for an existing drug has failed', function() {
    const notFound = 'The Medicine name was not found. Please check spelling.';
    beforeEach(function() {
      expect('.search-existing-drug .drug-not-found').not.toExist();
      var $application = new Cursor({page: 'compare', existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}], newDrug: null, search: 'advil', searchNew: '', errors: {existingDrugs: notFound, newDrug: null}}, cursorSpy);
      context.setProps({$application});
    });

    it('renders a message saying the drug is not found', function() {
      expect('.search-existing-drug .error').toHaveText(notFound);
    });

    describe('when the search is edited', function() {
      beforeEach(function() {
        $('.search-existing-drug input').val('other drug').simulate('change');
      });

      it('removes the message', function() {
        expect(cursorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
          errors: {existingDrugs: null, newDrug: null}
        }));
      });
    });
  });

  describe('when the search for a new drug has an error', function() {
    beforeEach(function() {
      expect('.search-new-drug .drug-not-found').not.toExist();
      var $application = new Cursor({page: 'compare', existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}], newDrug: '', search: 'advil', searchNew: '', errors: {existingDrugs: null, newDrug: 'error!'}}, cursorSpy);
      context.setProps({$application});
    });

    it('renders a message saying the drug is not found', function() {
      expect('.search-new-drug .error').toHaveText('error!');
    });
  });

  describe('when there are existing drugs', function() {
    var callbackSpy;
    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      var $application = new Cursor({page: 'compare', existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}, {searchString: 'claritin', name: 'LORATADINE'}], search: 'ibuprofen', errors}, callbackSpy);
      context.setProps({$application});
    });

    it('renders the results', function() {
      expect('.existing-drugs-list').toExist();
      expect('.existing-drugs-list li:eq(0)').toContainText('ibuprofen');
      expect('.existing-drugs-list li:eq(1)').toContainText('claritin (loratadine)');
    });

    describe('when deleting a drug', function() {
      it('removes the first drug', function() {
        $('.existing-drugs-list li:eq(0) .delete').simulate('click');
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({existingDrugs: [{searchString: 'claritin', name: 'LORATADINE'}]}));
      });

      it('removes the second drug', function() {
        $('.existing-drugs-list li:eq(1) .delete').simulate('click');
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}]}));
      });
    });
  });

  describe('when there is a new drug', function() {
    var callbackSpy;
    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      var $application = new Cursor({page: 'compare', existingDrugs: [{searchString: 'ibuprofen', name: 'IBUPROFEN'}], newDrug: {searchString: 'claritin', name: 'LORATADINE'}, search: 'ibuprofen', errors}, callbackSpy);
      context.setProps({$application});
    });

    it('renders a new drug', function() {
      expect('.new-drug').toContainText('claritin (loratadine)');
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
    const newDrug = {searchString: 'claritin', name: 'LORATADINE'};
    const existingDrugs = [{searchString: 'ibuprofen', name: 'IBUPROFEN'}, {searchString: 'advil', name: 'IBUPROFEN'}];

    var callbackSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      var $application = new Cursor({page: 'compare', existingDrugs, newDrug, search: '', errors}, callbackSpy);
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
        expect(DrugLabelApi.compareDrugs).toHaveBeenCalledWith('LORATADINE', ['IBUPROFEN', 'IBUPROFEN']);
      });

      it('sets the page to side effects', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({page: 'sideEffects'}));
      });

      describe('when the compare api is successful', function() {
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

          it('sets the sideEffects', function() {
            expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sideEffects: interactions}));
          });
        });

        describe('when there are no interactions', function() {
          const interactions = {};
          beforeEach(function() {
            compareDeferred.resolve(interactions);
          });

          it('sets the sideEffects', function() {
            expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sideEffects: interactions}));
          });
        });
      });
    });
  });
});