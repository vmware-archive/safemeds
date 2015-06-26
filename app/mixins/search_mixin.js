var Autocomplete = require('../components/autocomplete');
var React = require('react/addons');
var {PrimaryButton} = require('pui-react-buttons');
var Svg = require('../components/svg');
var DrugLabelMixin = require('../mixins/drug_label_mixin');

var types = React.PropTypes;

var SearchMixin = {
  mixins: [DrugLabelMixin],

  propTypes: {
    $application: types.object.isRequired
  },

  contextTypes: {
    trie: types.object
  },

  getInitialState() {
    return {
      requestInProgress: false
    };
  },

  async submit(e) {
    e.preventDefault();
    if (this.disabled()) return;
    this.setState({requestInProgress: true});
    try {
      var name = await this.search(this.props.$application.get(this.searchCursor));
      this.props.$application.refine(this.searchCursor).set('');
      var $results = this.props.$application.refine(this.resultsCursor);
      $results[$results.get() instanceof Array ? 'push' : 'set'](name);
    } catch (e) {
      this.props.$application.refine(this.notFoundCursor).set(true);
    }
    this.setState({requestInProgress: false});
  },

  updateSearch(search) {
    this.props.$application.refine(this.searchCursor).set(search);
    this.props.$application.refine(this.notFoundCursor).set(false);
  },

  change(e) {
    this.updateSearch(e.currentTarget.value);
  },

  disabled() {
    var $application = this.props.$application;
    var search = $application.get(this.searchCursor) || '';
    return !search.trim().length;
  },

  render() {
    var {trie} = this.context;
    var $application = this.props.$application;
    var search = $application.get(this.searchCursor) || '';
    var requestInProgress = this.state.requestInProgress;
    var flashMessage = $application.get(this.notFoundCursor) && (
      <div className="drug-not-found">
        <div>
          <Svg src="alert-pill" />
        </div>
        <span>The Medicine name was not found. Please check spelling.</span>
      </div>
    );

    var autoCompleteProps = {placeholder: this.placeholder, value: search, onChange: this.change, disabled: !search || requestInProgress, onAutocomplete: this.updateSearch, trie};
    return (
      <div className={this.className}>
        {flashMessage}
        <form className="form-inline" onSubmit={this.submit}>
          <div className="form-group">
            <Autocomplete className="search-drug-label" {...autoCompleteProps}/>
          </div>
        </form>
      </div>
    );
  }
};

module.exports = SearchMixin;