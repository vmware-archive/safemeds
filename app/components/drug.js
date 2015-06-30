var React = require('react/addons');
var Icon = require('pui-react-iconography').Icon;

var types = React.PropTypes;

var Drug = React.createClass({
  propTypes: {
    name: types.string.isRequired,
    searchString: types.string.isRequired,
    className: types.string,
    onDelete: types.func.isRequired
  },

  click() {
    var {name, onDelete} = this.props;
    onDelete(name);
  },

  render() {
    var {name, searchString, className} = this.props;
    var displayTitle = searchString.toLowerCase() === name.toLowerCase() ?
      <span>
        <span className="search-string">{name.toLowerCase()}</span>
      </span> :
      <span>
        <span className="search-string">{searchString.toLowerCase()}</span> <span className="corrected-string">({name.toLowerCase()})</span>
      </span>;
    return (
      <div {...{className}}>
        {displayTitle}
        <a className="delete" role="button" onClick={this.click}><Icon name="times" className="small-x"/></a>
      </div>
    );
  }
});

module.exports = Drug;