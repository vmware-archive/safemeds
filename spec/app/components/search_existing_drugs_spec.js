require('../spec_helper');

describe('SearchExistingDrugs', function() {
  const baseApiUrl = 'http://example.com';
  const search = 'wat';
  const existingDrugs = [{searchString: 'ibuprofen', name: 'IBUPROFEN'}, {searchString: 'water', name: 'WATER'}];
  const drugNames = ['water', 'coffee', 'advil', 'water lilies', 'angkor wat'];

  var SearchExistingDrugs, callbackSpy, context, searchPromise, trie, $application;
  const errors = {existingDrugs: null, newDrug: null};
  beforeEach(function() {
    SearchExistingDrugs = require('../../../app/components/search_existing_drugs');
    searchPromise = new Deferred();
    spyOn(SearchExistingDrugs.prototype.__reactAutoBindMap, 'search').and.returnValue(searchPromise);
    callbackSpy = jasmine.createSpy('callback');
    $application = new Cursor({search, existingDrugs, errors}, callbackSpy);

    var TrieSearch = require('trie-search');
    trie = new TrieSearch('name');
    drugNames.forEach(name => trie.add({name}));
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when rendered on mobile', function() {
    beforeEach(function() {
      spyOn(SearchExistingDrugs.prototype.__reactAutoBindMap, 'isDesktop').and.returnValue(false);
      context = withContext({config: {baseApiUrl}, trie}, {$application}, function() {
        var {$application} = this.props;
        return (<SearchExistingDrugs {...{$application}} ref="subject"/>);
      }, root);
    });

    it('does not focus on the existing drug search', function() {
      expect(context.refs.subject.autocompleteProps()).toEqual({autoFocus: false});
    });
  });

  describe('when rendered on the desktop', function() {
    beforeEach(function() {
      spyOn(SearchExistingDrugs.prototype.__reactAutoBindMap, 'isDesktop').and.returnValue(true);
      context = withContext({config: {baseApiUrl}, trie}, {$application}, function() {
        var {$application} = this.props;
        return (<SearchExistingDrugs {...{$application}} ref="subject"/>);
      }, root);
    });

    it('does not focus on the existing drug search', function() {
      expect(context.refs.subject.autocompleteProps()).toEqual({autoFocus: true});
    });

    it('displays the autocomplete list', function() {
      expect('.autocomplete-list').toExist();
      expect('.autocomplete-item').toHaveLength(3);
    });

    describe('when clicking on an autocomplete item', function() {
      beforeEach(function() {
        $('.autocomplete-item:eq(0)').simulate('click');
      });

      it('updates the cursor', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({search: 'water', existingDrugs}));
      });

      describe('after some time has passed', function() {
        beforeEach(function() {
          jasmine.clock().tick(1);
        });

        it('calls search', function() {
          expect(SearchExistingDrugs.prototype.__reactAutoBindMap.search).toHaveBeenCalled();
        });
      });
    });

    describe('when submitting the search', function() {
      beforeEach(function() {
        searchPromise.resolve(search.toUpperCase());
        $('.form-inline').simulate('submit');
        MockPromises.executeForResolvedPromises();
      });

      it('updates the cursor', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({search: '', existingDrugs: existingDrugs.concat({searchString: search, name: search.toUpperCase()})}));
      });
    });

    describe('when adding a drug that is already in the list', function(){
      beforeEach(function() {
        searchPromise.resolve(existingDrugs[0].name);
        $('.form-inline').simulate('submit');
        MockPromises.executeForResolvedPromises();
      });

      it('updates the cursor with an error', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({errors: {existingDrugs: jasmine.any(String), newDrug: null}}));
      });
    });

    describe('when there are already 5 drugs in the list', function() {
      const existingDrugs = ['ibuprofen', 'water', 'coffee', 'morphine', 'claritin']
        .map(searchString => ({searchString, name: searchString.toUpperCase()}));
      beforeEach(function() {
        var $application = new Cursor({search, existingDrugs, errors}, callbackSpy);
        context.setProps({$application});
      });

      describe('when adding another drug', function() {
        beforeEach(function() {
          searchPromise.resolve('prozac');
          $('.form-inline').simulate('submit');
          MockPromises.executeForResolvedPromises();
        });

        it('updates the cursor with an error', function() {
          expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({errors: {existingDrugs: jasmine.any(String), newDrug: null}}));
        });
      });
    });
  });
});