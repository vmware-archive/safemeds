var React = require('react/addons');
var Compare = require('./compare');

var types = React.PropTypes;

var Page = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    return (
      <div className="page">
        {$application.get('page') === 'compare' && <Compare {...{$application}}/>}
      </div>
    );
  }
});

module.exports = Page;