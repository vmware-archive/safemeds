var DrugsLayout = require('./drugs_layout');
var React = require('react/addons');
var SideEffect = require('./side_effect');

var types = React.PropTypes;

var SideEffects = React.createClass({
  propTypes: {
    sideEffects: types.object,
    newDrug: types.object.isRequired,
    $application: types.object.isRequired
  },

  back() {
    this.props.$application.merge({page: 'compare', sideEffects: null});
  },

  renderTitle() {
    var {newDrug, sideEffects, $application} = this.props;
    var existingDrugs = Object.keys(sideEffects || {});
    if (sideEffects === null) return 'Searching...';

    if (!existingDrugs.length) return 'Yay! There are no known interactions.';

    return `${existingDrugs.length} of ${$application.get('existingDrugs').length} medications interact with ${newDrug.name.toLowerCase()}`;
  },

  renderContent() {
    var {newDrug, sideEffects} = this.props;
    var existingDrugs = Object.keys(sideEffects || {});

    sideEffects = existingDrugs.map(function(existingDrug, key) {
      return (
        <div key={key}>
          {key !== 0 && <hr/>}
          <SideEffect {...{existingDrug, newDrug, sideEffect: sideEffects[existingDrug]}}/>
        </div>
      );
    });

    return (<section>{sideEffects}</section>);
  },

  render() {
    var {$application} = this.props;
    return (
      <div className="side-effects-page">
        <DrugsLayout {...{$application}}>
          <nav>
            <a className="back" role="button" onClick={this.back}>go back</a>
            <div className="summary">{this.renderTitle()}</div>
          </nav>
          {this.renderContent()}
        </DrugsLayout>
      </div>
    );
  }
});


module.exports = SideEffects;