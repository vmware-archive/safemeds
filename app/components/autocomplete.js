var classnames = require('classnames');
var React = require('react/addons');
var SearchInput = require('../components/search_input');
var sort = require('lodash.sortby');
var scrollIntoView = require('scroll-into-view');

var types = React.PropTypes;

const DOWN_KEY = 40;
const UP_KEY = 38;
const ENTER_KEY = 13;
const ESC_KEY = 27;

var privates = new WeakMap();

var Autocomplete = React.createClass({
  statics: {
    DOWN_KEY,
    UP_KEY,
    ENTER_KEY,
    ESC_KEY
  },

  propTypes: {
    minSearchTerm: types.number,
    maxItems: types.number,
    onAutocomplete: types.func.isRequired,
    onChange: types.func.isRequired,
    trie: types.object,
    value: types.any
  },

  getInitialState() {
    return {hidden: false, selectedSuggestion: -1};
  },

  getDefaultProps() {
    return {minSearchTerm: 2, maxItems: 50};
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
    var {minSearchTerm, maxItems, trie, value} = this.props;
    if (hidden || !trie || ('value' in this.props && value.length < minSearchTerm)) return null;
    var suggestedNames = sort(trie.get(value.trim()), ({name}) => name.length).slice(0, maxItems);
    privates.set(this, {suggestedNames});
    var suggestions = suggestedNames.map(({name}, key) => {
      var className = classnames('autocomplete-item', {selected: key === this.state.selectedSuggestion});
      return (<li key={key}><a href="#" onClick={this.click.bind(this, name)} role="button" title={name} className={className}>{name}</a></li>);
    });
    return (<ul className="autocomplete-list">{suggestions}</ul>);
  },

  keyDown(e) {
    var {keyCode} = e;
    var {selectedSuggestion} = this.state;
    var {suggestedNames} = privates.get(this);
    const keyCodes = {
      [DOWN_KEY]: () => {
        this.setState({selectedSuggestion: Math.min(selectedSuggestion + 1, suggestedNames.length - 1)});
        Array.from(React.findDOMNode(this).querySelectorAll('.selected')).map(scrollIntoView);
      },

      [UP_KEY]: () => {
        this.setState({selectedSuggestion: Math.max(selectedSuggestion - 1, -1)});
        Array.from(React.findDOMNode(this).querySelectorAll('.selected')).map(scrollIntoView);
      },

      [ENTER_KEY]: () => {
        var {suggestedNames = []} = privates.get(this) || {};
        if (suggestedNames[selectedSuggestion]) {
          e.preventDefault();
          this.autocomplete(suggestedNames[selectedSuggestion].name);
          this.setState({selectedSuggestion: -1});
        }
      },

      [ESC_KEY]: () => {
        this.setState({selectedSuggestion: -1, hidden: true});
      },

      noop() {}
    };
    keyCodes[keyCode in keyCodes ? keyCode : 'noop']();
  },

  render() {
    return (
      <span className="autocomplete">
        <SearchInput {...this.props} {...{onChange: this.change, onBlur: this.blur, onKeyDown: this.keyDown}} ref="input"/>
        {this.renderAutocompleteList()}
      </span>
    );
  }
});

module.exports = Autocomplete;