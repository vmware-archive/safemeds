require('../spec_helper');

describe('Drug', function() {
  const name = 'loratadine';
  const searchString = 'claritin';

  var subject, onDeleteSpy;
  beforeEach(function() {
    var Drug = require('../../../app/components/drug');
    onDeleteSpy = jasmine.createSpy('onDelete');
    subject = React.render(<Drug name={name} searchString={searchString} className="new-drug" onDelete={onDeleteSpy}/>, root);
  });

  it('renders the drug with class name', function() {
    expect('.new-drug').toContainText(`${searchString} (${name})`);
  });

  it('renders a delete link', function() {
    expect('a.delete').toExist();
  });

  describe('when the search string matches the name', function() {
    beforeEach(function() {
      subject.setProps({name: 'WATER', searchString: 'water'});
    });

    it('renders only the name', function() {
      expect('.new-drug').toContainText('water');
      expect('.new-drug').not.toContainText('water (water)');
    });
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