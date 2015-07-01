var AnimationMixin = require('../mixins/animation_mixin');
var DrugTitle = require('./drug_title');
var React = require('react/addons');
var Icon = require('pui-react-iconography').Icon;

var types = React.PropTypes;

var Drug = React.createClass({
  mixins: [AnimationMixin],

  propTypes: {
    name: types.string.isRequired,
    searchString: types.string.isRequired,
    className: types.string,
    onDelete: types.func.isRequired
  },

  getInitialState() {
    return {animateIn: false};
  },

  componentDidMount() {
    this.setState({animateIn: true});
  },

  click() {
    var {name, onDelete} = this.props;
    onDelete(name);
  },

  render() {
    var {className, name, searchString} = this.props;
    var {animateIn} = this.state;

    var opacity = this.animate('opacity', animateIn ? 1 : 0, 500, {easing: 'easeOutQuart', startValue: 0});
    var y = this.animate('y', animateIn ? 0 : -500, 500, {easing: 'easeOutQuart', startValue: -500});
    var transform = `translate3d(0,${y}px,0)`;
    var style = {opacity, transform, WebkitTransform: transform};
    return (
      <div {...{className, style}}>
        <DrugTitle {...{name, searchString}}/>
        <a className="delete" role="button" onClick={this.click}><Icon name="times" className="small-x"/></a>
      </div>
    );
  }
});

module.exports = Drug;