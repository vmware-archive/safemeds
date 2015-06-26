require('../spec_helper');

describe('Application', function() {
  const baseApiUrl = 'http://example.com';
  const drugNames = ['morphine', 'water', 'coffee'];
  var Page;
  beforeEach(function() {
    Page = require('../../../app/components/page');
    spyOn(Page.prototype, 'render').and.callThrough();
    var Application = require('../../../app/components/application');
    React.render(<Application {...{config: {baseApiUrl}, data: {drugNames}}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a page', function() {
    expect(Page.prototype.render).toHaveBeenCalled();
  });
});