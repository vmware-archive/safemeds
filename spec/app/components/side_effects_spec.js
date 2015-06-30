require('../spec_helper');

describe('SideEffects', function() {
  const newDrug = 'water';

  var pageCallbackSpy;
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
    var $application = new Cursor({page: 'sideEffects', sideEffects}, pageCallbackSpy);

    React.render(<SideEffects {...{sideEffects, newDrug, $application}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a title of known interactions', function() {
    expect('h2').toHaveText('3 found interactions');
  });

  it('renders a back button', function() {
    expect('.back').toExist();
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
    expect('hr').toHaveLength(2);
    expect('.side-effects-page hr + .side-effect:eq(0)').toExist();
    expect('.side-effects-page hr + .side-effect:eq(1)').toExist();
    expect('.side-effects-page hr + .side-effect:eq(2)').not.toExist();
  });

  describe('clicking the back button', function() {
    it('set the page to compare', function() {
      $('.back').simulate('click');
      expect(pageCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({page: 'compare', sideEffects: null}));
    });
  });
});