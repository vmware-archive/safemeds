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
    var drugLabels = await DrugLabelsApi.search({name, limit: 1});
    var $application = this.props.$application;
    if(!drugLabels.length) return;
    $application.refine('existingDrugs').push(name);
    $application.refine('search').set('');
  },

  componentDidMount() {
    var {baseApiUrl, apiKey} = this.context.config;
    DrugLabelsApi.baseApiUrl = baseApiUrl;
    DrugLabelsApi.apiKey = apiKey;
  }
};

module.exports = DrugLabelMixin;