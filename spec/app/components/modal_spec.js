require('../spec_helper');

describe('Modal', function() {
  var subject, modalCallbackSpy;
  beforeEach(function() {
    var Modal = require('../../../app/components/modal');
    modalCallbackSpy = jasmine.createSpy('callback');
    var $modal = new Cursor({interactions: false}, modalCallbackSpy);
    subject = React.render(<Modal $modal={$modal}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('does not render a view details link', function() {
    expect('.modal .view-details').not.toExist();
  });

  it('renders the expected text', function() {
    expect('.modal').toContainText('there are no known interactions');
  });

  it('does not have the interactions class', function() {
    expect('.circle').not.toHaveClass('interactions');
  });

  it('renders the happy pill', function() {
    expect('.happy-pill').toExist();
  });

  it('does not render the alert pill', function() {
    expect('.alert-pill').not.toExist();
  });

  it('renders a close modal link', function() {
    expect('.close-modal').toExist();
  });

  describe('when there are interactions', function() {
    beforeEach(function() {
      var $modal = new Cursor({interactions: true}, modalCallbackSpy);
      subject.setProps({$modal});
    });

    it('renders a view details link', function() {
      expect('.modal .view-details').toExist();
    });

    it('renders the expected text', function() {
      expect('.modal').toContainText('your medications have interactions');
    });

    it('has the interactions class', function() {
      expect('.circle').toHaveClass('interactions');
    });

    it('does not render the happy pill', function() {
      expect('.happy-pill').not.toExist();
    });

    it('renders the alert pill', function() {
      expect('.alert-pill').toExist();
    });
  });

  describe('when the close modal link is clicked', function() {
    beforeEach(function() {
      $('.close-modal').simulate('click');
    });

    it('sets the modal to null', function() {
      expect(modalCallbackSpy).toHaveBeenCalledWith(null);
    });
  });
});