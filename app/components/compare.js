var DrugsLayout = require('./drugs_layout');
var DrugLabelApi = require('../api/drug_label_api');
var {HighlightButton} = require('pui-react-buttons');
var SearchExistingDrugs = require('../components/search_existing_drugs');
var SearchNewDrug = require('../components/search_new_drug');
var Drug = require('./drug');

var React = require('react/addons');

var types = React.PropTypes;

var ExistingDrugsList = React.createClass({
  propTypes: {
    $existingDrugs: types.object.isRequired
  },

  onDelete(nameToDelete) {
    var drugToDelete = this.props.$existingDrugs.get().find(({name}) => name === nameToDelete);
    this.props.$existingDrugs.remove(drugToDelete);
  },

  render() {
    var existingDrugs = this.props.$existingDrugs.get().map(({searchString, name}, key) => {
      return (<li {...{key}}><Drug {...{name, searchString, className: 'existing-drug', onDelete: this.onDelete}}/></li>);
    });

    return (
      <ul className="existing-drugs-list">{existingDrugs}</ul>
    );
  }
});

var NewDrug = React.createClass({
  propTypes: {
    $newDrug: types.object.isRequired
  },

  onDelete() {
    this.props.$newDrug.set(null);
  },

  render() {
    var newDrug = this.props.$newDrug.get();
    if (!newDrug) return null;
    return (
      <Drug className="new-drug" {...{name: newDrug.name, searchString: newDrug.searchString, onDelete: this.onDelete}}/>
    );
  }
});

var Compare = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  async compare() {
    var {newDrug, existingDrugs} = this.props.$application.get();
    this.props.$application.refine('page').set('sideEffects');
    var sideEffects = await DrugLabelApi.compareDrugs(newDrug.name, existingDrugs.map(d => d.name));
    this.props.$application.refine('sideEffects').set(sideEffects);
  },

  renderLeft() {
    var {$application} = this.props;
    return (
      <div>
        <SearchExistingDrugs {...{$application}}/>
        <ExistingDrugsList {...{$existingDrugs: $application.refine('existingDrugs')}}/>
      </div>
    );
  },

  renderCenter() {
    var {$application} = this.props;
    var disabled = !!(!$application.get('existingDrugs').length || !$application.get('newDrug'));
    return (<button className="view-side-effects" disabled={disabled} onClick={this.compare}>View Interactions</button>);
  },

  renderRight() {
    var {$application} = this.props;

    return (
      <div>
        <SearchNewDrug {...{$application}}/>
        <NewDrug {...{$newDrug: $application.refine('newDrug')}}/>
      </div>
    );
  },

  render() {
    var {$application} = this.props;
    return (
      <div className="compare-page">
        <DrugsLayout {...{$application, left: this.renderLeft(), center: this.renderCenter(), right: this.renderRight()}}/>
      </div>
    );
  }
});

module.exports = Compare;