var React = require('react/addons');
var Svg = require('./svg');

var types = React.PropTypes;

var Drug = React.createClass({
  propTypes: {
    name: types.string.isRequired,
    className: types.string,
    onDelete: types.func.isRequired
  },

  click() {
    var {name, onDelete} = this.props;
    onDelete(name);
  },

  render() {
    var {name, className} = this.props;
    return (
      <div {...{className}}>
        <span>{name}</span>
        <a className="delete" role="button" onClick={this.click}><Svg src="small_x" className="small-x"/></a>
      </div>
    );
  }
});

module.exports = Drug;