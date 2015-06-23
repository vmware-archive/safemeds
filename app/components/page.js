var DrugLabelMixin = require('../mixins/drug_label_mixin');
var React = require('react/addons');
var {SearchInput} = require('pui-react-search-input');
var {PrimaryButton} = require('pui-react-buttons');

var types = React.PropTypes;

var SearchDrugs = React.createClass({
  mixins: [DrugLabelMixin],

  propTypes: {
    $application: types.object.isRequired
  },

  async submit(e) {
    e.preventDefault();
    await this.search(this.props.$application.get('search'));
  },

  change(e) {
    this.props.$application.refine('search').set(e.currentTarget.value);
  },

  render() {
    var $application = this.props.$application;
    var search = $application.get('search') || '';
    var disabled = !search.length;
    return (
      <div>
        <form className="form-inline" onSubmit={this.submit}>
          <div className="form-group">
            <SearchInput className="search-drug-label" placeholder="I'm currently taking" value={search}
                         onChange={this.change}/>
            {!disabled && <PrimaryButton type="submit" disabled={disabled}>Find </PrimaryButton>}
          </div>
        </form>
      </div>
    );
  }
});

var DrugLabelsList = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    var drugLabels = $application.get('drugLabels').map(function(name, key) {
      return (<li {...{key}}>{name}</li>);
    });

    return (
      <ul className="drug-labels-list">{drugLabels}</ul>
    );
  }
});

var Page = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
    return (
      <div className="page">
        <SearchDrugs {...{$application}}/>
        <DrugLabelsList {...{$application}}/>
      </div>
    );
  }
});

module.exports = Page;