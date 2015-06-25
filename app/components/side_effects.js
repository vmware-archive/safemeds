var React = require('react/addons');

var types = React.PropTypes;

function pluralize(count, singular, plural) {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural}`;
}

var SideEffect = React.createClass({
  propTypes: {
    newDrug: types.string.isRequired,
    existingDrug: types.string.isRequired,
    sideEffect: types.object.isRequired
  },
  render() {
    var {existingDrug, newDrug, sideEffect} = this.props;
    var i = 0;
    var [existingDrugInteractions, drugInQuestionInteractions] = ['existingDrug', 'drugInQuestion'].map(function(type) {
      return Object.keys(sideEffect[type]).reduce(function(memo, key) {
        var {text} = sideEffect[type][key];
        text.forEach(function() {
          memo.push(<p key={i++}>{text}</p>);
        });
        return memo;
      }, []);
    });

    var showExistingDrugTitle = !!existingDrugInteractions.length;
    var showDrugInQuestionTitle = !!drugInQuestionInteractions.length;
    return (
      <div className="side-effect">
        <h3>{existingDrug} + {newDrug}</h3>
        {showExistingDrugTitle && <h4>{existingDrug}</h4>}
        {existingDrugInteractions}
        {showDrugInQuestionTitle && <h4>{newDrug}</h4>}
        {drugInQuestionInteractions}
      </div>
    );
  }
});

var SideEffects = React.createClass({
  propTypes: {
    sideEffects: types.object.isRequired,
    newDrug: types.string.isRequired
  },

  render() {
    var {newDrug, sideEffects} = this.props;
    var existingDrugs = Object.keys(sideEffects);
    sideEffects = existingDrugs.map(function(existingDrug, key) {
      return (<SideEffect {...{existingDrug, newDrug, sideEffect: sideEffects[existingDrug], key}}/>);
    });

    return (
      <div className="side-effects-page">
        <h2>{pluralize(existingDrugs.length, 'found interaction', 'found interactions')}</h2>
        {sideEffects}
      </div>
    );
  }
});


module.exports = SideEffects;