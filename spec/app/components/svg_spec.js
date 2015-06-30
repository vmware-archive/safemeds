require('../spec_helper');

describe('Svg', function() {
  var subject;
  beforeEach(function() {
    var Svg = require('../../../app/components/svg');
    spyOn(Svg.prototype, 'render').and.callThrough();
    subject = React.render(<Svg src="pill-with-bg"/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders an svg', function() {
    expect('svg').toExist();
    expect('svg path').toExist();
  });

  it('renders the svg with the html attributes', function() {
    expect('svg').toHaveAttr('x', '0px');
    expect('svg').toHaveAttr('y', '0px');
    expect('svg').toHaveAttr('viewBox', '1533.6 1815.8 248.6 248.6');
  });

  describe('when there are props on the svg', function() {
    it('overrides the html attributes', function() {
      subject.setProps({x: '10px', y: '20px'});
      expect('svg').toHaveAttr('x', '10px');
      expect('svg').toHaveAttr('y', '20px');
    });
  });
});