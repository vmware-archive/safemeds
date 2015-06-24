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
      page: 'compare',
      search: null,
      searchNew: null,
      existingDrugs: [],
      newDrug: null
    };
  },

  render() {
    var $application = new Cursor(this.state, state => this.setState(state));
    return (
      <div className="18f">
        <Page {...{$application}}/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
