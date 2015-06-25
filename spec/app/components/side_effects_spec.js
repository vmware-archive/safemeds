require('../spec_helper');

describe('SideEffects', function() {
  const newDrug = 'water';
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
      }
    };

    React.render(<SideEffects {...{sideEffects, newDrug}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a title of known interactions', function() {
    expect('h2').toHaveText('2 found interactions');
  });

  it('renders the titles of the new drug with each side effect', function() {
    expect('.side-effects-page .side-effect:eq(0)').toContainText('coffee + water');
    expect('.side-effects-page .side-effect:eq(0) h4:eq(0)').toContainText('coffee');
    expect('.side-effects-page .side-effect:eq(0) h4:eq(1)').toContainText('water');
    expect('.side-effects-page .side-effect:eq(1)').toContainText('cipro + water');
    expect('.side-effects-page .side-effect:eq(1) h4:eq(0)').toContainText('cipro');
    expect('.side-effects-page .side-effect:eq(1) h4:eq(1)').toContainText('water');
  });

  it('renders the drug interactions', function() {
    expect('.side-effects-page .side-effect:eq(0)').toContainText('coffee is fatal');
    expect('.side-effects-page .side-effect:eq(0)').toContainText('water is fatal');
    expect('.side-effects-page .side-effect:eq(1)').toContainText('cipro is fatal');
    expect('.side-effects-page .side-effect:eq(1)').toContainText('water is fatal');
  });
});