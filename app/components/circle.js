var classnames = require('classnames');
var React = require('react/addons');
var {Icon} = require('pui-react-iconography');
var Svg = require('./svg');

var types = React.PropTypes;

var Circle = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  renderSpinner() {
    return (
      <div className="circle spinning">
        <div className="arc arc1"/>
        <div className="arc arc2"/>
        <div className="arc arc3"/>
        <div className="arc arc4"/>
      </div>
    );
  },

  renderFinishedCircle() {
    var {$application} = this.props;
    var {sideEffects = {}} = $application.get();
    var interactions = !!Object.keys(sideEffects).length;
    return (
      <div className={classnames('circle', {'no-interactions': !interactions, interactions})}>
        <Svg className={classnames({'happy-pill': !interactions, 'alert-pill': interactions})} src={interactions ? 'alert-pill' : 'happy-pill'}/>
      </div>
    );
  },

  render() {
    var {$application} = this.props;
    var {page, sideEffects} = $application.get();

    if (page === 'sideEffects') {
      if(sideEffects === null) return this.renderSpinner();
      return this.renderFinishedCircle();
    }
    return (
      <div className="circle">
        <Icon name="plus" className="and"/>
      </div>
    );
  }
});

module.exports = Circle;