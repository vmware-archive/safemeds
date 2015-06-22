var DrugLabelMixin = require('../mixins/drug_label_mixin');
var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');
var Table = require('./table');
var union = require('lodash.union');

var types = React.PropTypes;

var SearchDrugs = React.createClass({
  mixins: [DrugLabelMixin],

  getInitialState() {
    return {search: null};
  },

  async submit(e) {
    e.preventDefault();
    await this.search(this.state.search);
  },

  change(e) {
    this.setState({search: e.currentTarget.value});
  },

  render() {
    var {search} = this.state;
    return (
      <div>
        <form className="form-inline" onSubmit={this.submit}>
          <div className="form-group">
            <SearchInput className="search-drug-label" placeholder="Search Drug Labels" value={search}
                         onChange={this.change}/>
            <PrimaryButton>Search </PrimaryButton>
          </div>
        </form>
      </div>
    );
  }
});

var DrugLabelsList = React.createClass({
  propTypes: {
    $drugLabels: types.object.isRequired
  },

  render() {
    var {$drugLabels} = this.props;
    var columns = union(...$drugLabels.get().map(label => Object.keys(label)));

    var rows = $drugLabels.get()
      .map(function(row) {
        return columns.reduce(function(memo, column) {
          memo[column] = row[column];
          return memo;
        }, {});
      });

    return (
      <Table {...{rows, columns}}/>
    );
  }
});

var Page = React.createClass({
  propTypes: {
    $drugLabels: types.object.isRequired
  },

  render() {
    var {$drugLabels} = this.props;
    return (
      <div className="page">
        <SearchDrugs {...{$drugLabels}}/>
        <DrugLabelsList {...{$drugLabels}}/>
      </div>
    );
  }
});

module.exports = Page;