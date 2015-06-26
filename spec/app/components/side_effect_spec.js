require('../spec_helper');

describe('SideEffect', function() {
  const newDrug = 'water';
  const existingDrug = 'coffee';

  beforeEach(function() {
    var SideEffect = require('../../../app/components/side_effect');
    var sideEffect = {
      existingDrug: {
        drug_interactions: {text: ['coffee is fatal'], highlights: [[{start: 10, length: 5}]]},
        warnings: {text: ['water may cause death, take with caution']}
      },

      drugInQuestion: {
        drug_interactions: {text: ['water is fatal'], highlights: [[{start: 0, length: 5}, {start: 6, length: 2}]]},
        warnings: {text: ['water may cause death, take with caution']}
      }
    };
    React.render(<SideEffect {...{newDrug, existingDrug, sideEffect}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('highlights text', function() {
    expect('.highlight').toHaveLength(3);
    expect('.highlight:eq(0)').toHaveText('fatal');
    expect('.highlight:eq(1)').toHaveText('water');
    expect('.highlight:eq(2)').toHaveText('is');
  });
});
