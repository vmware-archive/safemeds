require('../spec_helper');

describe('TrieMixin', function() {
  var subject;
  const drugNames = ['water', 'coffee', 'advil', 'water lily'];

  beforeEach(function() {
    var TrieMixin = require('../../../app/mixins/trie_mixin');
    var Klass = React.createClass({
      mixins: [TrieMixin],
      render() { return null; }
    });
    subject = React.render(<Klass {...{data: {drugNames}}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('after some time has passed', function() {
    beforeEach(function() {
      jasmine.clock().tick(1);
      jasmine.clock().tick(1);
    });

    it('builds a trie which works', function() {
      expect(subject.state.trie.get('wat')).toEqual([{name: 'water'}, {name: 'water lily'}]);
    });
  });
});