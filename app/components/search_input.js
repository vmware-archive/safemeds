var React = require('react/addons');

var types = React.PropTypes;

var SearchInput = React.createClass({
  propTypes: {
    value: types.string.isRequired,
    onChange: types.func.isRequired,
    disabled: types.bool.isRequired
  },

  render() {
    return <div className="search-input"><input {...this.props} disabled={false}/><button disabled={this.props.disabled}>add</button></div>;
  }
});

module.exports = SearchInput;