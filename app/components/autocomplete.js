var React = require('react/addons');
var SearchInput = require('../components/search_input');

var types = React.PropTypes;

var Autocomplete = React.createClass({
  statics: {
    MIN_SEARCH_TERM: 2,
    MAX_ITEMS: 50
  },

  propTypes: {
    onAutocomplete: types.func.isRequired,
    onChange: types.func.isRequired,
    trie: types.object,
    value: types.any
  },

  getInitialState() {
    return {hidden: false};
  },

  autocomplete(name) {
    this.props.onAutocomplete(name);
    this.setState({hidden: true});
  },

  blur({relatedTarget}) {
    if (relatedTarget && relatedTarget.classList && relatedTarget.classList.contains('autocomplete-item')) return;
    this.setState({hidden: true});
  },

  change(e) {
    this.props.onChange(e);
    this.setState({hidden: false});
  },

  click(name, e) {
    e.preventDefault();
    this.autocomplete(name);
    Array.from(React.findDOMNode(this.refs.input).querySelectorAll('input')).map(e => e.focus());
  },

  renderAutocompleteList() {
    var {hidden} = this.state;
    var {trie, value} = this.props;
    if (hidden || !trie || value.length < Autocomplete.MIN_SEARCH_TERM) return null;
    var suggestions = trie.get(value.trim()).slice(0, Autocomplete.MAX_ITEMS).map(({name}, key) => (
      <li key={key}><a href="#" onClick={this.click.bind(this, name)} role="button" title={name} className="autocomplete-item">{name}</a></li>
    ));
    return (<ul className="autocomplete-list">{suggestions}</ul>);
  },

  render() {
    return (
      <span>
        <SearchInput {...this.props} {...{onChange: this.change, onBlur: this.blur}} ref="input"/>
        {this.renderAutocompleteList()}
      </span>
    );
  }
});

module.exports = Autocomplete;