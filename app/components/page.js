var DrugLabelMixin = require('../mixins/drug_label_mixin');
var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');
var {SortableTable} = require('pui-react-sortable-table');

var DrugLabelApi = require('../api/drug_label_api');

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
    const columnName = 'description';
    var rows = $drugLabels.get()
      .map(row => ({[columnName]: row[columnName].join(' ')}))
      .map(function(data, index) {
        return (
          <tr key={index}>
            <td>{data[columnName]}</td>
          </tr>);
    });

    return (
      <div className="table-scrollable table-scrollable-sm">
        <div className="table-scrollable-header">
          <table className="table table-data table-light">
            <thead>
              <tr>
                <th>{columnName}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="table-scrollable-body">
          <table className="table table-data table-light">
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
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