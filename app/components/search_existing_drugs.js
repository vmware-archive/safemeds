var SearchMixin = require('../mixins/search_mixin');
var React = require('react/addons');

var SearchExistingDrugs = React.createClass({
  mixins: [SearchMixin],

  className: 'search-existing-drug',

  searchCursor: 'search',

  resultsCursor: 'existingDrugs',

  placeholder: 'ex. Ambien',

  label: `I'm currently taking:`
});

module.exports = SearchExistingDrugs;