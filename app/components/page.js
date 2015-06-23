var DrugLabelMixin = require('../mixins/drug_label_mixin');
var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');
var Table = require('./table');
var union = require('lodash.union');

var types = React.PropTypes;

var SearchDrugs = React.createClass({
  mixins: [DrugLabelMixin],

  propTypes: {
    $application: types.object.isRequired
  },

  async submit(e) {
    e.preventDefault();
    await this.search(this.props.$application.get('search'));
  },

  change(e) {
    this.props.$application.refine('search').set(e.currentTarget.value);
  },

  render() {
    var search = this.props.$application.get('search');
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
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    var drugLabels = $application.get('drugLabels');
    if (drugLabels === null) {
      return null;
    }

    if (!drugLabels.length) {
      var search = $application.get('search');
      return (
        <div className="drug-labels-list">
          Sorry, there aren't any results for '{search}'
        </div>
      );
    }

    var columns = union(...drugLabels.map(label => Object.keys(label)));

    var rows = drugLabels
      .map(function(row) {
        return columns.reduce(function(memo, column) {
          memo[column] = row[column];
          return memo;
        }, {});
      });

    return (
      <div className="drug-labels-list">
        <Table {...{rows, columns}}/>
      </div>
    );
  }
});

var Page = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    return (
      <div className="page">
        <SearchDrugs {...{$application}}/>
        <DrugLabelsList {...{$application}}/>
      </div>
    );
  }
});

module.exports = Page;