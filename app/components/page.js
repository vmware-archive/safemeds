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
    var page = $application.get('page');
    var modal = $application.get('modal');
    return (
      <div className="page">
        <header className="main">
          <h1 className="logo"><span>Safe<br/>Meds</span></h1>
          <h1 className="tagline">
            <span className="before">Know the effects</span>
            <span className="separator">></span>
            <span className="after">before you ingest</span>
          </h1>
        </header>
        {page === 'compare' && <Compare {...{$application}}/>}
        {page === 'sideEffects' && <SideEffects {...{$application}}/>}
        {modal && <Modal {...modal}/>}
      </div>
    );
  }
});

module.exports = Page;