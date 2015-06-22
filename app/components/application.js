require('babel/polyfill');
var Cursor = require('pui-cursor');
var Layout = require('../../server/components/layout');
var React = require('react/addons');
var Page = require('./page');

var types = React.PropTypes;

var Application = React.createClass({
  propTypes: {
    config: types.object.isRequired,
    data: types.object.isRequired
  },

  childContextTypes: {
    config: types.object.isRequired
  },

  getChildContext() {
    var {config} = this.props;
    return {config};
  },

  getInitialState() {
    return {
      drugLabels: []
    };
  },

  render() {
    var $drugLabels = new Cursor(this.state.drugLabels, drugLabels => this.setState({drugLabels}));

    return (
      <div className="18f">
        <Page {...{$drugLabels}}/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
