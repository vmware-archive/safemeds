require('../spec_helper');

describe('Page', function() {
  const page = 'compare';
  var Modal, SideEffects, Compare, DrugLabelApi, searchDeferred, subject;
  beforeEach(function() {
    DrugLabelApi = require('../../../app/api/drug_label_api');
    searchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(searchDeferred.promise());
    Compare = require('../../../app/components/compare');
    spyOn(Compare.prototype, 'render').and.callThrough();
    var Page = require('../../../app/components/page');
    SideEffects = require('../../../app/components/side_effects');
    spyOn(SideEffects.prototype, 'render').and.callThrough();
    Modal = require('../../../app/components/modal');
    spyOn(Modal.prototype, 'render').and.callThrough();
    var $application = new Cursor({page, existingDrugs: [], search: null, modal: null}, jasmine.createSpy('drugLabels'));
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

  it('does not draw the modal', function() {
    expect(Modal.prototype.render).not.toHaveBeenCalled();
  });

  describe('when modal is set', function() {
    beforeEach(function() {
      Compare.prototype.render.calls.reset();
      var $application = new Cursor({page, existingDrugs: [], search: null, modal: {interactions: true}}, jasmine.createSpy('drugLabels'));
      subject.setProps({$application});
    });

    it('draws the modal with the interactions', function() {
      expect(Modal.prototype.render).toHaveBeenCalled();
      expect(Modal.prototype.render.calls.mostRecent().object.props.interactions).toBe(true);
    });
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