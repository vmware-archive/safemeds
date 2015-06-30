var classnames = require('classnames');
var DrugsLayout = require('./drugs_layout');
var React = require('react/addons');
var SideEffect = require('./side_effect');
var {Icon} = require('pui-react-iconography');

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

  renderSummary() {
    var {newDrug, sideEffects, $application} = this.props;
    var existingDrugs = Object.keys(sideEffects || {});

    var summaryText = () => {
      if (sideEffects === null) return {text: 'Searching...'};

      if (!existingDrugs.length) return {text: 'Yay! There are no known interactions.', className: 'no-interactions'};

      return {text: `${existingDrugs.length} of ${$application.get('existingDrugs').length} medications interact with ${newDrug.name.toLowerCase()}`, className: 'interactions'};
    };
    var {className, text} = summaryText();
    return (<div className={classnames('summary', className)}>{text}</div>);
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
            {this.renderSummary()}
            <a className="back" role="button" onClick={this.back}><Icon name="angle-left"/> go back</a>
          </nav>
          {this.renderContent()}
        </DrugsLayout>
      </div>
    );
  }
});


module.exports = SideEffects;