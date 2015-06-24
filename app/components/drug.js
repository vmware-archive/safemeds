var React = require('react/addons');

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
        <a className="delete" role="button" onClick={this.click}>delete</a>
        <span>{name}</span>
      </div>
    );
  }
});

module.exports = Drug;