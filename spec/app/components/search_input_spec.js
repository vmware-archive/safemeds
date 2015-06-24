require('../spec_helper');

describe('SearchInput', function() {
  var subject;
  beforeEach(function() {
    var SearchInput = require('../../../app/components/search_input');
    var props = {
      placeholder: 'placeholder',
      className: 'foo',
      value: 'search',
      onChange: () => {}
    };
    subject = React.render(<SearchInput {...props}/>, root);
  });

  it('enables the button when there is text in the input', function() {
    expect('button').not.toHaveAttr('disabled');
  });

  it('disables the button when there is no text', function() {
    subject.setProps({value: ''});
    expect('button').toHaveAttr('disabled');
  });
});