require('../spec_helper');

describe('SideEffects', function() {
  const newDrug = {name: 'water'};

  var subject, pageCallbackSpy;
  beforeEach(function() {
    var SideEffects = require('../../../app/components/side_effects');
    var sideEffects = {
      coffee: {
        existingDrug: {
          drug_interactions: {text: ['coffee is fatal']},
          warnings: {text: ['water may cause death, take with caution']}
        },

        drugInQuestion: {
          drug_interactions: {text: ['water is fatal']},
          warnings: {text: ['water may cause death, take with caution']}
        }
      },

      cipro: {
        existingDrug: {
          drug_interactions: {text: ['cipro is fatal']},
          warnings: {text: ['cipro may cause death, take with caution']}
        },

        drugInQuestion: {
          drug_interactions: {text: ['water is fatal']},
          warnings: {text: ['cipro may cause death, take with caution']}
        }
      },

      morphine: {
        existingDrug: {
          drug_interactions: {text: ['morphine is fatal']},
          warnings: {text: ['cipro may cause death, take with caution']}
        },

        drugInQuestion: {
          drug_interactions: {text: ['water is fatal']},
          warnings: {text: ['cipro may cause death, take with caution']}
        }
      }
    };

    pageCallbackSpy = jasmine.createSpy('callback');
    var $application = new Cursor({page: 'sideEffects', sideEffects, existingDrugs: ['a', 'b', 'c']}, pageCallbackSpy);

    subject = React.render(<SideEffects {...{sideEffects, newDrug, $application}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a summary of known interactions', function() {
    expect('.summary').toHaveText('3 of 3 medications interact with water');
    expect('.summary').not.toHaveClass('no-interactions');
    expect('.summary').toHaveClass('interactions');
  });

  it('renders a back button', function() {
    expect('.back').toExist();
  });

  it('renders a table of contents', function() {
    expect('.table-of-contents a:eq(0)').toHaveText('coffee + water');
    expect('.table-of-contents a:eq(1)').toHaveText('cipro + water');
    expect('.table-of-contents a:eq(2)').toHaveText('morphine + water');
  });

  it('renders the titles of the new drug with each side effect', function() {
    expect('.side-effects-page .side-effect:eq(0)').toContainText('coffee + water');
    expect('.side-effects-page .side-effect:eq(0) h4:eq(0)').toContainText('coffee');
    expect('.side-effects-page .side-effect:eq(0) h4:eq(1)').toContainText('water');

    expect('.side-effects-page .side-effect:eq(1)').toContainText('cipro + water');
    expect('.side-effects-page .side-effect:eq(1) h4:eq(0)').toContainText('cipro');
    expect('.side-effects-page .side-effect:eq(1) h4:eq(1)').toContainText('water');

    expect('.side-effects-page .side-effect:eq(2)').toContainText('morphine + water');
    expect('.side-effects-page .side-effect:eq(2) h4:eq(0)').toContainText('morphine');
    expect('.side-effects-page .side-effect:eq(2) h4:eq(1)').toContainText('water');

  });

  it('renders the drug interactions', function() {
    expect('.side-effects-page .side-effect:eq(0)').toContainText('coffee is fatal');
    expect('.side-effects-page .side-effect:eq(0)').toContainText('water is fatal');

    expect('.side-effects-page .side-effect:eq(1)').toContainText('cipro is fatal');
    expect('.side-effects-page .side-effect:eq(1)').toContainText('water is fatal');

    expect('.side-effects-page .side-effect:eq(2)').toContainText('morphine is fatal');
    expect('.side-effects-page .side-effect:eq(2)').toContainText('water is fatal');
  });

  it('draws horizontal rules', function() {
    expect('.interactions hr').toHaveLength(2);
    expect('.side-effects-page .interactions hr + .side-effect:eq(0)').toExist();
    expect('.side-effects-page .interactions hr + .side-effect:eq(1)').toExist();
    expect('.side-effects-page .interactions hr + .side-effect:eq(2)').not.toExist();
  });

  describe('using the table of contents', function() {
    beforeEach(function() {
      spyOn(subject, 'scrollTo');
      $('.table-of-contents a:eq(1)').simulate('click');
    });

    it('scrolls to the relevant side effect detail', function() {
      expect(subject.scrollTo).toHaveBeenCalled();
    });
  });

  describe('when searching for interactions', function() {
    beforeEach(function() {
      subject.setProps({sideEffects: null});
    });

    it('renders a title of known interactions', function() {
      expect('.summary').toHaveText('Searching...');
      expect('.summary').not.toHaveClass('no-interactions');
      expect('.summary').not.toHaveClass('interactions');
    });
  });

  describe('when there are no interactions', function() {
    beforeEach(function() {
      subject.setProps({sideEffects: {}});
    });

    it('renders a title of known interactions', function() {
      expect('.summary').toHaveText('There are no known interactions.');
      expect('.summary').toHaveClass('no-interactions');
      expect('.summary').not.toHaveClass('interactions');
    });
  });

  describe('clicking the back button', function() {
    it('set the page to compare', function() {
      $('.back').simulate('click');
      expect(pageCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({page: 'compare', sideEffects: null}));
    });
  });
});