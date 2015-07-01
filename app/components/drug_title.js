var React = require('react/addons');
var types = React.PropTypes;

var DrugTitle = React.createClass({
  propTypes: {
    name: types.string.isRequired,
    searchString: types.string.isRequired
  },

  render() {
    var {name, searchString} = this.props;
    if (searchString.toLowerCase() === name.toLowerCase()) {
      return (
        <span>
          <span className="search-string">{name.toLowerCase()}</span>
        </span>
      );
    }
    return (
      <span>
        <span className="search-string">{searchString.toLowerCase()}</span> <span className="corrected-string">({name.toLowerCase()})</span>
      </span>
    );
  }
});

module.exports = DrugTitle;