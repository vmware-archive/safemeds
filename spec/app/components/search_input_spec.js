require('../spec_helper');

describe('SearchInput', function() {
  var subject;
  beforeEach(function() {
    var SearchInput = require('../../../app/components/search_input');
    subject = React.render(<SearchInput value="value" onChange={jasmine.createSpy('change')}/>, root);
    spyOn(subject, 'scrollTo');
  });

  describe('when clicking on the input', function() {
    describe('for large windows', function() {
      beforeEach(function() {
        safemeds.matchMedia.and.returnValue({matches: false});
        $('.search-input-wrapper input').simulate('click');
      });

      it('does not scroll', function() {
        expect(subject.scrollTo).not.toHaveBeenCalled();
      });
    });

    describe('for small windows', function() {
      beforeEach(function() {
        safemeds.matchMedia.and.returnValue({matches: true});
        $('.search-input-wrapper input').simulate('click');
      });

      it('scrolls to the input', function() {
        expect(subject.scrollTo).toHaveBeenCalledWith(0, jasmine.any(Number), {duration: 300});
      });
    });
  });
});