var DrugLabelsApi = require('../api/drug_label_api');
var React = require('react/addons');

var types = React.PropTypes;

var DrugLabelMixin = {
  contextTypes: {
    config: types.object.isRequired
  },

  propTypes: {
    $application: types.object.isRequired
  },

  async search(name) {
    var drugLabels = await DrugLabelsApi.search({name});
    this.props.$application.refine('drugLabels').set(drugLabels);
  },

  componentDidMount() {
    var {baseApiUrl} = this.context.config;
    DrugLabelsApi.baseApiUrl = baseApiUrl;

  }
};

module.exports = DrugLabelMixin;