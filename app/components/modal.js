var classnames = require('classnames');
var React = require('react/addons');

var types = React.PropTypes;

var Modal = React.createClass({
  propTypes: {
    interactions: types.bool.isRequired
  },

  render() {
    var {interactions} = this.props;
    var message;
    if (interactions) {
      message = 'wait! your medications have interactions.';
    } else {
      message = 'yah! there are no known interactions.';
    }

    return (
      <div className="modal">
        <div className={classnames('circle', {interactions})}>
          <div className="message">{message}</div>
          {interactions && <a className="view-details">view details</a>}
        </div>
      </div>
    );
  }
});

module.exports = Modal;
