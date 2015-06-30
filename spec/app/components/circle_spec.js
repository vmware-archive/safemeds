require('../spec_helper');

describe('Circle', function() {
  var subject;
  beforeEach(function() {
    var Circle = require('../../../app/components/circle');
    var $application = new Cursor({page: 'compare', sideEffects: null}, jasmine.createSpy('callback'));
    subject = React.render(<Circle {...{$application}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a circle', function() {
    expect('.circle').toExist();
  });

  it('does not spin', function() {
    expect('.circle').not.toHaveClass('spinning');
  });

  describe('when on the side effects page with pending side effects', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'sideEffects', sideEffects: null}, jasmine.createSpy('callback'));
      subject.setProps({$application});
    });

    it('spins the circle', function() {
      expect('.circle').toHaveClass('spinning');
      expect('.circle .arc').toExist();
    });
  });

  describe('when on the side effects page with no side effects', function() {
    beforeEach(function() {
      var $application = new Cursor({page: 'sideEffects', sideEffects: {}}, jasmine.createSpy('callback'));
      subject.setProps({$application});
    });

    it('renders the expected circle', function() {
      expect('.circle').not.toHaveClass('interactions');
      expect('.circle').not.toHaveClass('spinning');
      expect('.circle .happy-pill').toExist();
    });
  });

  describe('when on the side effects page with side effects', function() {
    beforeEach(function() {
      var sideEffects = { drug1: 'foo' };
      var $application = new Cursor({page: 'sideEffects', sideEffects}, jasmine.createSpy('callback'));
      subject.setProps({$application});
    });

    it('renders the expected circle', function() {
      expect('.circle').toHaveClass('interactions');
      expect('.circle').not.toHaveClass('spinning');
      expect('.circle .alert-pill').toExist();
    });
  });
});
