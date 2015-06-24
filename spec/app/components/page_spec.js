require('../spec_helper');

describe('Page', function() {
  var Compare, DrugLabelApi, searchDeferred;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    Compare = require('../../../app/components/compare');
    spyOn(Compare.prototype, 'render').and.callThrough();
    var Page = require('../../../app/components/page');
    var $application = new Cursor({page: 'compare', existingDrugs: [], search: null}, jasmine.createSpy('drugLabels'));
    withContext({config: {}}, {$application}, function() {
      var {$application} = this.props;
      return (<Page {...{$application}}/>);
    }, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders the compare component', function() {
    expect(Compare.prototype.render).toHaveBeenCalled();
  });
});