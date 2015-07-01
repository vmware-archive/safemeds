var SearchMixin = require('../mixins/search_mixin');
var React = require('react/addons');

var SearchNewDrug = React.createClass({
  mixins: [SearchMixin],

  className: 'search-new-drug',

  searchCursor: 'searchNew',

  resultsCursor: 'newDrug',

  placeholder: 'ex. Rifampin',

  label: `I'm about to take:`
});

module.exports = SearchNewDrug;