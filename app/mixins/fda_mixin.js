var FdaApi = require('../api/fda_api');
var React = require('react/addons');

var types = React.PropTypes;

var FdaMixin = {
  propTypes: {
    config: types.object,
    $events: types.object
  },

  async componentDidMount() {
    var {baseApiUrl} = this.props.config;
    FdaApi.baseApiUrl = baseApiUrl;
    var events = await FdaApi.events();
    this.props.$events.set(events);
  }
};

module.exports = FdaMixin;