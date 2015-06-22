require('../spec_helper');

describe('Table', function() {
  beforeEach(function() {
    var Table = require('../../../app/components/table');
    var columns = ['name', 'rank'];
    var rows = [
      {name: 'Alice', rank: 'Corporal'},
      {name: 'Bob', rank: 'Major'}
    ];
    React.render(<Table {...{columns, rows}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders the column names', function() {
    expect('.table-scrollable').toContainText('name');
    expect('.table-scrollable').toContainText('rank');
  });

  it('renders row data', function() {
    expect('.table-scrollable-body tr:eq(0)').toContainText('Alice');
    expect('.table-scrollable-body tr:eq(0)').toContainText('Corporal');
    expect('.table-scrollable-body tr:eq(1)').toContainText('Bob');
    expect('.table-scrollable-body tr:eq(1)').toContainText('Major');
  });
});