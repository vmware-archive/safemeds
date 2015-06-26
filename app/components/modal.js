var classnames = require('classnames');
var React = require('react/addons');
var Svg = require('./svg');

var types = React.PropTypes;

var Modal = React.createClass({
  propTypes: {
    $modal: types.object.isRequired,
    $page: types.object.isRequired
  },

  close() {
    this.props.$modal.set(null);
  },

  viewDetails() {
    this.close();
    this.props.$page.set('sideEffects');
  },

  render() {
    var $modal = this.props.$modal.get();
    var {interactions} = $modal || {};
    var message;
    if (interactions) {
      message = 'wait! your medications have interactions.';
    } else {
      message = 'yah! there are no known interactions.';
    }

    var spinningCircle = (
      <div className="circle spinning">
        <div className="arc arc1"/>
        <div className="arc arc2"/>
        <div className="arc arc3"/>
        <div className="arc arc4"/>
      </div>
    );

    var finishedCircle = (
      <div className={classnames('circle', {interactions})}>
        <Svg className={classnames({'happy-pill': !interactions, 'alert-pill': interactions})} src={interactions ? 'alert-pill' : 'happy-pill'}/>
        <div className="message">{message}</div>
        {interactions && <a className="view-details" role="button" onClick={this.viewDetails}>view details</a>}
      </div>
    );

    return (
      <div className="modal">
        <a className="close-modal" role="button" onClick={this.close}>close<Svg src="big_x" className="big-x"/></a>
        <span className="searching">searching</span>
        {'interactions' in $modal ? finishedCircle : spinningCircle}
      </div>
    );
  }
});

module.exports = Modal;
