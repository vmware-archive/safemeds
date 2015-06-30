var React = require('react/addons');
var Icon = require('pui-react-iconography').Icon;
var types = React.PropTypes;

const BREAK_WIDTH = 750;

var SearchInput = React.createClass({
  propTypes: {
    value: types.string.isRequired,
    onChange: types.func.isRequired,
    disabled: types.bool,
    requestInProgress: types.bool
  },

  statics: {
    BREAK_WIDTH
  },

  getDefaultProps() {
    return {disabled: false, requestInProgress: false};
  },

  click() {
    var {matches} = safemeds.matchMedia.call(window, `(max-width: ${BREAK_WIDTH}px)`);
    if (!matches) return;
    var {top} = React.findDOMNode(this).getBoundingClientRect();
    this.scrollTo(0, window.scrollY + top, {duration: 300});
  },

  scrollTo(...args) {
    var scrollTo = require('scroll-to');
    scrollTo(...args);
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
        <input {...this.props} disabled={requestInProgress} onClick={this.click}/>
        {requestInProgress ? spinner : <button disabled={disabled}><Icon name="arrow-right"/></button>}
      </div>);
  }
});

module.exports = SearchInput;