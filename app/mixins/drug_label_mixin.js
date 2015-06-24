var DrugLabelsApi = require('../api/drug_label_api');
var React = require('react/addons');

var types = React.PropTypes;

var DrugLabelMixin = {
  contextTypes: {
    config: types.object.isRequired
  },

  search(name) {
    return DrugLabelsApi.search({name, limit: 1}).then(drugLabels => {
      if(!drugLabels.length) return Promise.reject();
      return name;
    });
  },

  componentDidMount() {
    var {baseApiUrl, apiKey} = this.context.config;
    DrugLabelsApi.baseApiUrl = baseApiUrl;
    DrugLabelsApi.apiKey = apiKey;
  }
};

module.exports = DrugLabelMixin;