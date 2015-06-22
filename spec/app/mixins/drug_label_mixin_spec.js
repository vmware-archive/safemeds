require('../spec_helper');

describe('DrugLabelMixin', function() {
  const baseApiUrl = '/api';
  var subject, drugLabelsCallbackSpy, DrugLabelApi, labelSearchDeferred;

  beforeEach(function() {
    var DrugLabelMixin = require('../../../app/mixins/drug_label_mixin');
    DrugLabelApi = require('../../../app/api/drug_label_api');
    labelSearchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(labelSearchDeferred.promise());
    var Klass = React.createClass({
      mixins: [DrugLabelMixin],
      render() { return null; }
    });
    drugLabelsCallbackSpy = jasmine.createSpy('eventData');
    var $drugLabels = new Cursor([], drugLabelsCallbackSpy);
    var config = {baseApiUrl};
    var context = withContext({config}, function() {
      return (<Klass {...{$drugLabels}} ref="subject"/>);
    }, root);
    subject = context.refs.subject;
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('search', function() {
    beforeEach(function() {
      subject.search('foo');
    });
    it('fetches labels from the correct api on load', function() {
      expect(DrugLabelApi.baseApiUrl).toEqual(baseApiUrl);
      expect(DrugLabelApi.search).toHaveBeenCalledWith({name: 'foo'});
    });

    describe('when the fetch completes', function() {
      var labelData;
      beforeEach(function() {
        labelData = Factory.buildList('drugLabel', 3);
        labelSearchDeferred.resolve(labelData);
        MockPromises.executeForResolvedPromises();
      });

      it('updates the data', function() {
        expect(drugLabelsCallbackSpy).toHaveBeenCalledWith(labelData);
      });
    });
  });
});