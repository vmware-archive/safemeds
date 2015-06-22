var FdaMixin = require('../mixins/fda_mixin');
var React = require('react/addons');

var Page = React.createClass({
  mixins: [FdaMixin],

  render() {
    return (
      <div>Hello World</div>
    );
  }
});

module.exports = Page;