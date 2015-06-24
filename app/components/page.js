var React = require('react/addons');
var Compare = require('./compare');
var Modal = require('./modal');
var SideEffects = require('./side_effects');
var Svg = require('./svg');

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
        <header className="main">
          <Svg className="logo" src="logo"/>
        </header>
        {page === 'compare' && <Compare {...{$application}}/>}
        {page === 'sideEffects' && <SideEffects {...{$application}}/>}
        {$application.get('modal') && <Modal {...{$modal: $application.refine('modal')}}/>}
      </div>
    );
  }
});

module.exports = Page;