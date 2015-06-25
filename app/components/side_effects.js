var React = require('react/addons');
var SideEffect = require('./side_effect');
var Svg = require('./svg');

var types = React.PropTypes;

function pluralize(count, singular, plural) {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural}`;
}

var SideEffects = React.createClass({
  propTypes: {
    sideEffects: types.object.isRequired,
    newDrug: types.string.isRequired,
    $page: types.object.isRequired
  },

  back() {
    this.props.$page.set('compare');
  },

  render() {
    var {newDrug, sideEffects} = this.props;
    var existingDrugs = Object.keys(sideEffects);
    sideEffects = existingDrugs.map(function(existingDrug, key) {
      return (
        <div key={key}>
          {key !== 0 && <hr/>}
          <SideEffect {...{existingDrug, newDrug, sideEffect: sideEffects[existingDrug]}}/>
        </div>
      );
    });

    return (
      <div className="side-effects-page">
        <a className="back" role="button" onClick={this.back}><Svg src="arrow" className="arrow"/>back</a>
        <h2>{pluralize(existingDrugs.length, 'found interaction', 'found interactions')}</h2>
        {sideEffects}
      </div>
    );
  }
});


module.exports = SideEffects;