var es = require('event-stream');
var React = require('react/addons');
var TrieSearch = require('trie-search');

var types = React.PropTypes;

var TrieMixin = {
  propTypes: {
    data: types.object.isRequired
  },

  childContextTypes: {
    trie: types.object
  },

  getInitialState() {
    return {trie: null};
  },

  getChildContext() {
    var {trie} = this.state;
    return {trie};
  },

  componentDidMount() {
    var trie = new TrieSearch('name');

    var {drugNames} = this.props.data;
    es.readable(function(count, callback) {
      if(count >= drugNames.length) this.emit('end');
      callback(null, drugNames[count]);
    }).pipe(es.map(name => trie.add({name})));

    this.setState({trie});
  }
};

module.exports = TrieMixin;