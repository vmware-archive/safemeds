var DrugLabelMixin = require('../mixins/drug_label_mixin');
var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');

var DrugLabelApi = require('../api/drug_label_api');

var SearchDrugs = React.createClass({
  getInitialState() {
    return {search: null};
  },

  async submit(e) {
    e.preventDefault();
    await DrugLabelApi.search(this.state.search);
  },

  change(e) {
    this.setState({search: e.currentTarget.value});
  },

  render() {
    var {search} = this.state;
    return (
      <form className="form-inline" onSubmit={this.submit}>
        <div className="form-group">
          <SearchInput className="search-drug-label" placeholder="Search Drug Labels" value={search}
                       onChange={this.change}/>
          <PrimaryButton>Search </PrimaryButton>
        </div>
      </form>
    );
  }
});

var Page = React.createClass({
  mixins: [DrugLabelMixin],

  render() {
    return (
      <div className="page">
        <SearchDrugs/>
      </div>
    );
  }
});

module.exports = Page;