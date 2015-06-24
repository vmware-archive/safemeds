var React = require('react/addons');
var Compare = require('./compare');
var SideEffects = require('./side_effects');

var types = React.PropTypes;

var Page = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    var page = $application.get('page');
    return (
      <div className="page">
        {page === 'compare' && <Compare {...{$application}}/>}
        {page === 'sideEffects' && <SideEffects {...{$application}}/>}
      </div>
    );
  }
});

module.exports = Page;