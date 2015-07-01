require('../spec_helper');

describe('Circle', function() {
  var subject;
  const errors = {sideEffects: null};
  beforeEach(function() {
    var Circle = require('../../../app/components/circle');
    var $application = new Cursor({page: 'compare', sideEffects: null, errors}, jasmine.createSpy('callback'));
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

  describe('when on the side effects page', function() {
    describe('with pending side effects', function() {
      beforeEach(function() {
        var $application = new Cursor({page: 'sideEffects', sideEffects: null, errors}, jasmine.createSpy('callback'));
        subject.setProps({$application});
      });

      it('spins the circle', function() {
        expect('.circle').toHaveClass('spinning');
        expect('.circle .arc').toExist();
      });
    });

    describe('with no side effects', function() {
      beforeEach(function() {
        var $application = new Cursor({page: 'sideEffects', sideEffects: {}, errors}, jasmine.createSpy('callback'));
        subject.setProps({$application});
      });

      it('renders the expected circle', function() {
        expect('.circle').not.toHaveClass('interactions');
        expect('.circle').not.toHaveClass('spinning');
        expect('.circle .happy-pill').toExist();
      });
    });

    describe('with side effects', function() {
      beforeEach(function() {
        var sideEffects = { drug1: 'foo' };
        var $application = new Cursor({page: 'sideEffects', sideEffects, errors}, jasmine.createSpy('callback'));
        subject.setProps({$application});
      });

      it('renders the expected circle', function() {
        expect('.circle').toHaveClass('interactions');
        expect('.circle').not.toHaveClass('spinning');
        expect('.circle .alert-pill').toExist();
      });
    });

    describe('with errors', function() {
      const errors = 'something went wrong';
      beforeEach(function() {
        var $application = new Cursor({page: 'sideEffects', sideEffects: null, errors: {sideEffects: errors}}, jasmine.createSpy('callback'));
        subject.setProps({$application});
      });

      it('does not have a spinning circle', function() {
        expect('.circle').not.toHaveClass('spinning');
        expect('.circle').toHaveClass('error');
      });
    });
  });
});
