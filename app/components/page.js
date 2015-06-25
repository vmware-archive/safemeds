var React = require('react/addons');
var Compare = require('./compare');
var Modal = require('./modal');
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

    var $modal = $application.refine('modal');
    var $page = $application.refine('page');
    return (
      <div className="page">
        {page === 'compare' && <Compare {...{$application}}/>}
        {page === 'sideEffects' && <SideEffects {...{newDrug, sideEffects, $page}}/>}
        {$application.get('modal') && <Modal {...{$modal, $page}}/>}
      </div>
    );
  }
});

module.exports = Page;