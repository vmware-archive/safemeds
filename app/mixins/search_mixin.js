var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');
var DrugLabelMixin = require('../mixins/drug_label_mixin');

var types = React.PropTypes;

var SearchMixin = {
  mixins: [DrugLabelMixin],

  propTypes: {
    $application: types.object.isRequired
  },

  async submit(e) {
    e.preventDefault();
    if (this.disabled()) return;

    var name = await this.search(this.props.$application.get(this.searchCursor));
    this.props.$application.refine(this.searchCursor).set('');
    var $results = this.props.$application.refine(this.resultsCursor);
    $results[$results.get() instanceof Array ? 'push' : 'set'](name);
  },

  change(e) {
    this.props.$application.refine(this.searchCursor).set(e.currentTarget.value);
  },

  disabled() {
    var $application = this.props.$application;
    var search = $application.get(this.searchCursor) || '';
    return !search.trim().length;
  },

  render() {
    var $application = this.props.$application;
    var search = $application.get(this.searchCursor) || '';
    return (
      <div>
        <form className="form-inline" onSubmit={this.submit}>
          <div className="form-group">
            <SearchInput className="search-drug-label" placeholder={this.placeholder} value={search}
                         onChange={this.change}/>
            {!this.disabled() && <PrimaryButton type="submit">Find</PrimaryButton>}
          </div>
        </form>
      </div>
    );
  }
};

module.exports = SearchMixin;