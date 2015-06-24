var React = require('react/addons');

var types = React.PropTypes;

var SearchInput = React.createClass({
  propTypes: {
    value: types.string
  },

  render() {
    return <div className="search-input"><input {...this.props}/><button disabled={!this.props.value}>add</button></div>;
  }
});

module.exports = SearchInput;