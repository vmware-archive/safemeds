require('babel/polyfill');
var Cursor = require('pui-cursor');
var Footer = require('./footer');
var Layout = require('../../server/components/layout');
var React = require('react/addons');
var Page = require('./page');
var TrieMixin = require('../mixins/trie_mixin');

var types = React.PropTypes;

var Application = React.createClass({
  mixins: [TrieMixin],

  propTypes: {
    config: types.object.isRequired,
    data: types.object.isRequired
  },

  childContextTypes: {
    config: types.object.isRequired
  },

  getChildContext() {
    var {config} = this.props;
    return {config};
  },

  getInitialState() {
    return {
      modal: null,
      page: 'compare',
      search: null,
      searchNew: null,
      existingDrugs: [],
      newDrug: null,
      sideEffects: null,
      errors: {
        existingDrugs: null,
        newDrug: null
      }
    };
  },

  render() {
    var $application = new Cursor(this.state, state => this.setState(state));
    return (
      <div className="safe-meds">
        <Page {...{$application}}/>
        <Footer/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
