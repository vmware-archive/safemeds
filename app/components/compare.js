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

  onDelete(name) {
    this.props.$existingDrugs.remove(name);
  },

  render() {
    var existingDrugs = this.props.$existingDrugs.get().map((name, key) => {
      return (<li {...{key}}><Drug {...{name, className: "existing-drug", onDelete: this.onDelete}}/></li>);
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
            <div className="image-wrapper">
              <Svg className="pill-bottle" src="pill-bottle"/>
            </div>
            <SearchExistingDrugs {...{$application}}/>
            <ExistingDrugsList {...{$existingDrugs: $application.refine('existingDrugs')}}/>
          </div>

          <div className="compare-center">
            <div className="image-wrapper">
              <div className="circle">
                <span>and</span>
              </div>
            </div>
            <button className="view-side-effects" disabled={disabled} onClick={this.compare}>View Side Effects</button>
          </div>

          <div className="compare-right">
            <div className="image-wrapper">
              <Svg src="pill" className="pill"/>
            </div>
            <SearchNewDrug {...{$application}}/>
            <NewDrug {...{$newDrug: $application.refine('newDrug')}}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Compare;