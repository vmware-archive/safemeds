var classnames = require('classnames');
var React = require('react/addons');
var {Icon} = require('pui-react-iconography');
var Svg = require('./svg');

var types = React.PropTypes;

var Circle = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  renderCircle(circleState) {
    var {$application, ...props} = this.props;

    const circleStates = {
      spinning() {
        var children = [
          <div className="arc arc1" key="arc1"/>,
          <div className="arc arc2" key="arc2"/>,
          <div className="arc arc3" key="arc3"/>,
          <div className="arc arc4" key="arc4"/>];
        return {className: 'spinning', children};
      },
      finished() {
        var {sideEffects = {}} = $application.get();
        var interactions = !!Object.keys(sideEffects).length;
        var children = [
          <Svg className={classnames({'happy-pill': !interactions, 'alert-pill': interactions})} src={interactions ? 'alert-pill' : 'happy-pill'} key="svg"/>,
          <span className="caption" key="caption">{interactions ? 'Wait!' : 'Yay!'}</span>
        ];
        return {className: classnames({'no-interactions': !interactions, interactions}), children};
      },
      error() {
        return {className: 'error', children: <Svg className="alert-pill" src="alert-pill"/>};
      },
      _default() {
        return {children: <Icon name="plus" className="and"/>};
      }
    };

    var {children, className} = circleStates[circleState].call(this);
    return (
      <div {...props} className={classnames('circle', className)}>{children}</div>
    );
  },

  render() {
    var {errors, page, sideEffects} = this.props.$application.get();

    var circleState = '_default';
    if (page === 'sideEffects') {
      if (errors.sideEffects) {
        circleState = 'error';
      } else if (sideEffects === null) {
        circleState = 'spinning';
      } else {
        circleState = 'finished';
      }
    }
    return this.renderCircle(circleState);
  }
});

module.exports = Circle;