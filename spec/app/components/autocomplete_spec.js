require('../spec_helper');

describe('Autocomplete', function() {
  const drugNames = ['water', 'coffee', 'advil', 'water lilies', 'angkor wat'];

  var Autocomplete, autocompleteSpy;
  beforeEach(function() {
    Autocomplete = require('../../../app/components/autocomplete');

    var TrieSearch = require('trie-search');
    var trie = new TrieSearch('name');
    drugNames.forEach(name => trie.add({name}));


    autocompleteSpy = jasmine.createSpy('autocomplete');
    var props = {
      onChange: jasmine.createSpy('change'),
      onAutocomplete: autocompleteSpy,
      value: 'wat',
      trie
    };

    React.render(<Autocomplete {...props}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders', function() {
    expect('.autocomplete').toExist();
  });

  it('renders the list', function() {
    expect('.autocomplete-list').toExist();
  });

  it('does add the selected class to autocomplete items', function() {
    expect('.autocomplete-item.selected').not.toExist();
  });

  describe('when the blur event is triggered', function() {
    beforeEach(function() {
      $('.autocomplete input').simulate('blur');
    });

    it('hides the list', function() {
      expect('.autocomplete-list').not.toExist();
    });
  });

  describe('when the down is pressed', function() {
    beforeEach(function() {
      $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.DOWN_KEY});
    });

    it('adds selected class to the first autocomplete item', function() {
      expect('.autocomplete-item:eq(0)').toHaveClass('selected');
    });

    describe('when the escape key is pressed', function() {
      beforeEach(function() {
        $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.ESC_KEY});
      });

      it('hides the list', function() {
        expect('.autocomplete-list').not.toExist();
      });
    });

    describe('when the enter key is pressed', function() {
      beforeEach(function() {
        $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.ENTER_KEY});
      });

      it('hides the list', function() {
        expect('.autocomplete-list').not.toExist();
      });

      it('calls the autocomplete callback', function() {
        expect(autocompleteSpy).toHaveBeenCalledWith('water');
      });
    });

    describe('when the down key is pressed again', function() {
      beforeEach(function() {
        $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.DOWN_KEY});
      });

      it('adds selected class to the first autocomplete item', function() {
        expect('.autocomplete-item:eq(0)').not.toHaveClass('selected');
        expect('.autocomplete-item:eq(1)').toHaveClass('selected');
      });

      describe('when the up key is pressed', function() {
        beforeEach(function() {
          $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.UP_KEY});
        });

        it('adds selected class to the first autocomplete item', function() {
          expect('.autocomplete-item:eq(0)').toHaveClass('selected');
          expect('.autocomplete-item:eq(1)').not.toHaveClass('selected');
        });

        describe('when the up key is pressed again', function() {
          beforeEach(function() {
            $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.UP_KEY});
          });

          it('unselects any autocomplete suggestions', function() {
            expect('.autocomplete-item.selected').not.toExist();
          });
        });
      });
    });
  });

  describe('when the up key is pressed', function() {
    beforeEach(function() {
      $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.UP_KEY});
    });
    it('does not do anything', function() {
      expect('.autocomplete-item.selected').not.toExist();
    });

    it('does not break key down', function() {
      $('.autocomplete input').simulate('keyDown', {keyCode: Autocomplete.DOWN_KEY});
      expect('.autocomplete-item:eq(0)').toHaveClass('selected');
    });
  });
});