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
    var modal = $application.get('modal');
    return (
      <div className="page">
        <header className="main">
          <Svg className="logo" src="logo"/>
        </header>
        {page === 'compare' && <Compare {...{$application}}/>}
        {page === 'sideEffects' && <SideEffects {...{$application}}/>}
        {modal && <Modal {...modal}/>}
      </div>
    );
  }
});

module.exports = Page;