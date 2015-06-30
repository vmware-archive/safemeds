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
    var {newDrug, sideEffects} = $application.get();
    var page = $application.get('page');

    var $page = $application.refine('page');
    return (
      <div className="page">
        {page === 'compare' && <Compare {...{$application}}/>}
        {page === 'sideEffects' && <SideEffects {...{$application, newDrug, sideEffects, $page}}/>}
      </div>
    );
  }
});

module.exports = Page;