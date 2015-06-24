var SearchExistingDrugs = require('../components/search_existing_drugs');
var SearchNewDrug = require('../components/search_new_drug');

var React = require('react/addons');

var types = React.PropTypes;

var ExistingDrugsList = React.createClass({
  propTypes: {
    $existingDrugs: types.object.isRequired
  },

  render() {
    var existingDrugs = this.props.$existingDrugs.get().map(function(name, key) {
      return (<li {...{key}}>{name}</li>);
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

  render() {
    var newDrug = this.props.$newDrug.get();
    if (!newDrug) return null;
    return (
      <div className="new-drug">{newDrug}</div>
    );
  }
});

var Compare = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    return (
      <div>
        <SearchExistingDrugs {...{$application}}/>
        <ExistingDrugsList {...{$existingDrugs: $application.refine('existingDrugs')}}/>
        <SearchNewDrug {...{$application}}/>
        <NewDrug {...{$newDrug: $application.refine('newDrug')}}/>
      </div>
    );
  }
});

module.exports = Compare;