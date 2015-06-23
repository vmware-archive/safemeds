var React = require('react/addons');

var types = React.PropTypes;

var Table = React.createClass({
  propTypes: {
    rows: types.array.isRequired,
    columns: types.array.isRequired
  },

  render() {
    var rows = this.props.rows.map((data, rowNum) => {
      var columns = this.props.columns.map(function(column, colNum) {
        return (
          <td key={colNum}>{data[column]}</td>
        );
      });
      return (
        <tr key={rowNum}>
          {columns}
        </tr>);
    });

    var columnHeader = this.props.columns.map(function(column, colNum) {
      return (
        <th key={colNum}>{column}</th>
      );
    });

    return (
      <div className="table-scrollable table-scrollable-sm">
        <div className="table-scrollable-header">
          <table className="table table-data table-light drug-label-table">
            <thead>
            <tr>
              {columnHeader}
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = Table;