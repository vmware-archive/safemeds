var React = require('react/addons');
var Icon = require('pui-react-iconography').Icon;
var types = React.PropTypes;
var ResponsiveMixin = require('../mixins/responsive_mixin');
var ScrollToMixin = require('../mixins/scroll_to_mixin');

var SearchInput = React.createClass({
  mixins: [ResponsiveMixin, ScrollToMixin],

  propTypes: {
    autoFocus: types.bool,
    value: types.string.isRequired,
    onChange: types.func.isRequired,
    disabled: types.bool,
    requestInProgress: types.bool
  },

  getDefaultProps() {
    return {disabled: false, requestInProgress: false};
  },

  click() {
    if (this.isDesktop()) return;
    var {top} = React.findDOMNode(this).getBoundingClientRect();
    this.scrollTo(0, window.scrollY + top, {duration: 300});
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