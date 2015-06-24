var types = React.PropTypes;

var Drug = React.createClass({
  propTypes: {
    name: types.string.isRequired,
    className: types.string
  },

  render() {
    var {name, className} = this.props;
    return (<div {...{className}}>{name}</div>);
  }
});

module.exports = Drug;