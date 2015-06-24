var classnames = require('classnames');
var React = require('react/addons');
var Svg = require('./svg');

var types = React.PropTypes;

var Modal = React.createClass({
  propTypes: {
    $modal: types.object.isRequired
  },

  close() {
    this.props.$modal.set(null);
  },

  render() {
    var {interactions} = this.props.$modal.get() || {};
    var message;
    if (interactions) {
      message = 'wait! your medications have interactions.';
    } else {
      message = 'yah! there are no known interactions.';
    }

    return (
      <div className="modal">
        <a className="close-modal" role="button" onClick={this.close}>close<Svg src="big_x" className="big-x"/></a>
        <div className={classnames('circle', {interactions})}>
          <Svg className={classnames({'happy-pill': !interactions, 'alert-pill': interactions})} src={interactions ? 'alert-pill' : 'happy-pill'}/>
          <div className="message">{message}</div>
          {interactions && <a className="view-details">view details</a>}
        </div>
      </div>
    );
  }
});

module.exports = Modal;
