var FdaApi = require('../api/fda_api');
var React = require('react/addons');

var types = React.PropTypes;

var FdaMixin = {
  contextTypes: {
    config: types.object.isRequired
  },

  propTypes: {
    $events: types.object.isRequired
  },

  async componentDidMount() {
    var {baseApiUrl} = this.context.config;
    FdaApi.baseApiUrl = baseApiUrl;
    var events = await FdaApi.events();
    this.props.$events.set(events);
  }
};

module.exports = FdaMixin;