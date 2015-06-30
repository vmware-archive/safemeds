require('../spec_helper');

describe('SearchNewDrug', function() {
  const errors = {existingDrugs: null, newDrug: null};
  const baseApiUrl = 'http://example.com';
  const searchNew = 'search';
  const drugNames = ['water', 'coffee', 'advil', 'water lilies', 'angkor wat'];

  var subject, callbackSpy;
  beforeEach(function() {
    var SearchNewDrug = require('../../../app/components/search_new_drug');
    callbackSpy = jasmine.createSpy('callback');
    var $application = new Cursor({searchNew, newDrug: null, errors}, callbackSpy);
    var TrieSearch = require('trie-search');
    var trie = new TrieSearch('name');
    drugNames.forEach(name => trie.add({name}));
    subject = withContext({config: {baseApiUrl}, trie}, {$application}, function() {
      var {$application} = this.props;
      return (<SearchNewDrug {...{$application}} ref="subject"/>);
    }, root);
  });

  describe('when entering at least two values in the the search', function() {
    beforeEach(function() {
      var $application = new Cursor({searchNew: 'wa', newDrug: null, errors}, callbackSpy);
      subject.setProps({$application});
    });

    it('renders an autocomplete list sorted by length', function() {
      expect('.autocomplete-list li').toHaveLength(3);
      expect('.autocomplete-list li:eq(0)').toHaveText('water');
      expect('.autocomplete-list li:eq(1)').toHaveText('angkor wat');
      expect('.autocomplete-list li:eq(2)').toHaveText('water lilies');
    });

    describe('when clicking on an autocomplete item', function() {
      beforeEach(function() {
        $('.autocomplete-list li:eq(2) a').simulate('click');
      });

      it('updates the search', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({searchNew: 'water lilies'}));
        expect('.search-input').toBeFocused();
      });

      it('hides the list', function() {
        expect('.autocomplete-list').not.toExist();
      });
    });

    describe('when clicking away', function() {
      beforeEach(function() {
        $('.search-input').simulate('blur');
        jasmine.clock().tick(1);
        MockPromises.executeForResolvedPromises();
      });

      it('hides the list', function() {
        expect('.autocomplete-list').not.toExist();
      });
    });
  });

  describe('when submitting the search', function() {
    beforeEach(function() {
      spyOn(subject.refs.subject, 'search').and.returnValue(Promise.resolve(searchNew.toUpperCase()));
      $('.form-inline').simulate('submit');
      MockPromises.executeForResolvedPromises();
    });

    it('updates the cursor', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({searchNew: '', newDrug: {searchString: searchNew, name: searchNew.toUpperCase()}}));
    });
  });
});