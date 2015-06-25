var React = require('react/addons');
var types = React.PropTypes;

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
          text.forEach(text => memo.push(<p key={i++}>{text}</p>));
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

module.exports = SideEffect;