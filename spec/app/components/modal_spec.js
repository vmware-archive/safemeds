require('../spec_helper');

describe('Modal', function() {
  var subject;
  beforeEach(function() {
    var Modal = require('../../../app/components/modal');
    subject = React.render(<Modal interactions={false}/>, root);
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

  describe('when there are interactions', function() {
    beforeEach(function() {
      subject.setProps({interactions: true});
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
  });
});