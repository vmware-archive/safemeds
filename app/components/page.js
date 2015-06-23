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
    if (this.disabled()) return;
    await this.search(this.props.$application.get('search'));
  },

  change(e) {
    this.props.$application.refine('search').set(e.currentTarget.value);
  },

  disabled() {
    var $application = this.props.$application;
    var search = $application.get('search') || '';
    return !search.trim().length;
  },

  render() {
    var $application = this.props.$application;
    var search = $application.get('search') || '';
    return (
      <div>
        <form className="form-inline" onSubmit={this.submit}>
          <div className="form-group">
            <SearchInput className="search-drug-label" placeholder="I'm currently taking" value={search}
                         onChange={this.change}/>
            {!this.disabled() && <PrimaryButton type="submit">Find</PrimaryButton>}
          </div>
        </form>
      </div>
    );
  }
});

var ExistingDrugsList = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    var existingDrugs = $application.get('existingDrugs').map(function(name, key) {
      return (<li {...{key}}>{name}</li>);
    });

    return (
      <ul className="existing-drugs-list">{existingDrugs}</ul>
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
        <ExistingDrugsList {...{$application}}/>
      </div>
    );
  }
});

module.exports = Page;