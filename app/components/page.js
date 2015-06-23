var DrugLabelMixin = require('../mixins/drug_label_mixin');
var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');

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
    var $application = this.props.$application;
    var search = $application.get('search') || '';
    var disabled = !search.length;
    return (
      <div>
        <form className="form-inline" onSubmit={this.submit}>
          <div className="form-group">
            <SearchInput className="search-drug-label" placeholder="Search Drug Labels" value={search}
                         onChange={this.change}/>
            <PrimaryButton type="submit" disabled={disabled}>Search </PrimaryButton>
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

    var brandNames = drugLabels.map(row => row.openfda.brand_name).map(function(brandName, key) {
      return (<li {...{key}}>{brandName}</li>);
    });

    return (
      <ul className="drug-labels-list">{brandNames}</ul>
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