var DrugLabelApi = require('../api/drug_label_api');
var {HighlightButton} = require('pui-react-buttons');
var SearchExistingDrugs = require('../components/search_existing_drugs');
var SearchNewDrug = require('../components/search_new_drug');
var Drug = require('./drug');
var Svg = require('./svg');

var React = require('react/addons');

var types = React.PropTypes;

var ExistingDrugsList = React.createClass({
  propTypes: {
    $existingDrugs: types.object.isRequired
  },

  onDelete() {

  },

  render() {
    var existingDrugs = this.props.$existingDrugs.get().map((name, key) => {
      return (<li {...{key}}><Drug {...{name, onDelete: this.onDelete}}/></li>);
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

  },

  render() {
    var newDrug = this.props.$newDrug.get();
    if (!newDrug) return null;
    return (
      <Drug className="new-drug" {...{name: newDrug, onDelete: this.onDelete}}/>
    );
  }
});

var Compare = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  async compare() {
    var {newDrug, existingDrugs} = this.props.$application.get();
    var interactions = await DrugLabelApi.compareDrugs(newDrug, existingDrugs);
    this.props.$application.refine('modal').set({interactions: !!Object.keys(interactions).length});
  },

  render() {
    var {$application} = this.props;
    var disabled = !!(!$application.get('existingDrugs').length && !$application.get('newDrug'));
    return (
      <div className="compare-page">
        <h1 className="tagline">
          <span className="before">Know the effects</span>
          <span className="separator">></span>
          <span className="after">before you ingest.</span>
        </h1>

        <div className="compare-body">
          <div className="compare-left">
            <Svg src="pill-bottle"/>
            <SearchExistingDrugs {...{$application}}/>
            <ExistingDrugsList {...{$existingDrugs: $application.refine('existingDrugs')}}/>
          </div>

          <div className="compare-center">
            <button className="view-side-effects" disabled={disabled} onClick={this.compare}>View Side Effects</button>
          </div>

          <div className="compare-right">
            <Svg src="pill"/>
            <SearchNewDrug {...{$application}}/>
            <NewDrug {...{$newDrug: $application.refine('newDrug')}}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Compare;