require('../spec_helper');

describe('Page', function() {
  const page = 'compare';
  var SideEffects, Compare, DrugLabelApi, searchDeferred, subject;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    Compare = require('../../../app/components/compare');
    spyOn(Compare.prototype, 'render').and.callThrough();
    var Page = require('../../../app/components/page');
    SideEffects = require('../../../app/components/side_effects');
    spyOn(SideEffects.prototype, 'render').and.callThrough();
    var $application = new Cursor({page, existingDrugs: [], search: null}, jasmine.createSpy('drugLabels'));
    subject = withContext({config: {}}, {$application}, function() {
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

  it('does not renders the side effects component', function() {
    expect(SideEffects.prototype.render).not.toHaveBeenCalled();
  });

  describe('when the page is sideEffects', function() {
    const page = 'sideEffects';
    beforeEach(function() {
      Compare.prototype.render.calls.reset();
      var $application = new Cursor({page, existingDrugs: [], search: null}, jasmine.createSpy('drugLabels'));
      subject.setProps({$application});
    });

    it('renders the side effects component', function() {
      expect(SideEffects.prototype.render).toHaveBeenCalled();
    });

    it('does not renders the compare component', function() {
      expect(Compare.prototype.render).not.toHaveBeenCalled();
    });
  });
});