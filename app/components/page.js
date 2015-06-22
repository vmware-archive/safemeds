var FdaMixin = require('../mixins/fda_mixin');
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
      <form onSubmit={this.submit}>
        <SearchInput className="search-drug-label" placeholder="Search Drug Labels" value={search} onChange={this.change}/>
        <PrimaryButton>Search </PrimaryButton>
      </form>
    );
  }
});

var Page = React.createClass({
  mixins: [FdaMixin],

  render() {
    return (
      <div className="page">
        <SearchDrugs/>
      </div>
    );
  }
});

module.exports = Page;