var SearchMixin = require('../mixins/search_mixin');
var React = require('react/addons');

var SearchExistingDrugs = React.createClass({
  mixins: [SearchMixin],

  searchCursor: 'search',

  resultsCursor: 'existingDrugs',

  placeholder: `I'm currently taking`
});

module.exports = SearchExistingDrugs;