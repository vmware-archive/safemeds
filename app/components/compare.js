var DrugLabelApi = require('../api/drug_label_api');
var Drug = require('./drug');
var {HighlightButton} = require('pui-react-buttons');
var ResponsiveMixin = require('../mixins/responsive_mixin');
var SearchExistingDrugs = require('../components/search_existing_drugs');
var SearchNewDrug = require('../components/search_new_drug');
var ScrollToMixin = require('../mixins/scroll_to_mixin');
var Svg = require('./svg');

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
  mixins: [ResponsiveMixin, ScrollToMixin],

  statics: {
    ERROR_MESSAGE: 'Sorry! Something unexpected happened, please try again.'
  },

  propTypes: {
    $application: types.object.isRequired
  },

  async compare() {
    if (!this.isDesktop()) this.scrollTo(0, 0, {duration: 300});
    var {newDrug, existingDrugs} = this.props.$application.get();
    this.props.$application.refine('page').set('sideEffects');
    try {
      var sideEffects = await DrugLabelApi.compareDrugs(newDrug.name, existingDrugs.map(d => d.name));
      this.props.$application.refine('sideEffects').set(sideEffects);
    } catch(e) {
      var error = e && e.drug ? '1 or more medications were not found in the FDA Database. Please try again with a new medication.' : Compare.ERROR_MESSAGE;
      this.props.$application.refine('errors', 'sideEffects').set(error);
    }
  },

  render() {
    var {$application} = this.props;
    var disabled = !!(!$application.get('existingDrugs').length || !$application.get('newDrug'));
    return (
      <div className="compare-page">
        <div className="compare-body">
          <div className="compare-left">
            <div className="pill-bottles-mobile"><Svg src="pill-bottles"/></div>
            <SearchExistingDrugs {...{$application}}/>
            <ExistingDrugsList {...{$existingDrugs: $application.refine('existingDrugs')}}/>
          </div>

          <div className="compare-right">
            <div className="pill-mobile"><Svg src="pill"/></div>
            <SearchNewDrug {...{$application}}/>
            <div className="new-drug-wrapper">
              <NewDrug {...{$newDrug: $application.refine('newDrug')}}/>
            </div>
          </div>
        </div>

        <div className="compare-footer">
          <button className="view-side-effects" disabled={disabled} onClick={this.compare}>Check Interactions</button>
        </div>
      </div>
    );
  }
});

module.exports = Compare;