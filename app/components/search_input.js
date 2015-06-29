var React = require('react/addons');

var types = React.PropTypes;

var SearchInput = React.createClass({
  propTypes: {
    value: types.string.isRequired,
    onChange: types.func.isRequired,
    disabled: types.bool.isRequired,
    requestInProgress: types.bool
  },

  render() {
    var {requestInProgress, disabled} = this.props;
    var spinner = (
      <div className="circle-wrapper">
        <div className="circle-spinner spinning">
          <div className="arc arc1"/>
          <div className="arc arc2"/>
          <div className="arc arc3"/>
          <div className="arc arc4"/>
        </div>
      </div>
    );

    return (
      <div className="search-input-wrapper">
        <input {...this.props} disabled={requestInProgress}/>
        {requestInProgress ? spinner : <button disabled={disabled}>add</button>}
      </div>);
  }
});

module.exports = SearchInput;