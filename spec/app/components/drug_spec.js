require('../spec_helper');

describe('Drug', function() {
  const name = 'claritin';

  var onDeleteSpy;
  beforeEach(function() {
    var Drug = require('../../../app/components/drug');
    onDeleteSpy = jasmine.createSpy('onDelete');
    React.render(<Drug name={name} className="new-drug" onDelete={onDeleteSpy}/>, root);
  });

  it('renders the drug with class name', function() {
    expect('.new-drug').toContainText(name);
  });

  it('renders a delete link', function() {
    expect('a.delete').toExist();
  });

  describe('when the delete link', function() {
    beforeEach(function() {
      $('a.delete').simulate('click');
    });

    it('calls on the onDelete', function() {
      expect(onDeleteSpy).toHaveBeenCalledWith(name);
    });
  });
});