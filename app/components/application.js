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

  getInitialState() {
    return {
      events: []
    };
  },

  render() {
    var {config} = this.props;
    var $events = new Cursor(this.state.events, events => this.setState({events}));

    return (
      <div className="18f">
        <Page {...{config, $events}}/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
