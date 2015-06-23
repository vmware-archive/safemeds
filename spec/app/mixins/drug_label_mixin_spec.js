require('../spec_helper');

describe('DrugLabelMixin', function() {
  const apiKey = '12345';
  const baseApiUrl = 'http://example.com/api';
  var subject, applicationCallbackSpy, DrugLabelApi, labelSearchDeferred;

  beforeEach(function() {
    var DrugLabelMixin = require('../../../app/mixins/drug_label_mixin');
    DrugLabelApi = require('../../../app/api/drug_label_api');
    labelSearchDeferred = new Deferred();
    spyOn(DrugLabelApi, 'search').and.returnValue(labelSearchDeferred.promise());
    var Klass = React.createClass({
      mixins: [DrugLabelMixin],
      render() { return null; }
    });
    applicationCallbackSpy = jasmine.createSpy('callback');
    var $application = new Cursor({drugLabels: null}, applicationCallbackSpy);
    var config = {baseApiUrl, apiKey};
    var context = withContext({config}, function() {
      return (<Klass {...{$application}} ref="subject"/>);
    }, root);
    subject = context.refs.subject;
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('sets the base api url', function() {
    expect(DrugLabelApi.baseApiUrl).toEqual(baseApiUrl);
  });

  it('sets the api key', function() {
    expect(DrugLabelApi.apiKey).toEqual(apiKey);
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
        expect(applicationCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({drugLabels: labelData}));
      });
    });
  });
});