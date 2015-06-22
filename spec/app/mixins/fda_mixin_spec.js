require('../spec_helper');

describe('FdaMixin', function() {
  const baseApiUrl = '/api';
  var eventDataCallbackSpy;

  beforeEach(function() {
    var FdaMixin = require('../../../app/mixins/fda_mixin');
    var Klass = React.createClass({
      mixins: [FdaMixin],
      render() { return null; }
    });
    eventDataCallbackSpy = jasmine.createSpy('eventData');
    var $events = new Cursor({}, eventDataCallbackSpy);
    var config = {baseApiUrl};
    withContext({config}, function() {
      return (<Klass {...{$events}}/>);
    }, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('fetches events from the correct api on load', function() {
    expect(`${baseApiUrl}/drug/event.json`).toHaveBeenRequested();
  });

  describe('when the fetch completes', function() {
    var events, request;
    beforeEach(function() {
      request = jasmine.Ajax.requests.mostRecent();
      events = Factory.buildList('event', 3);
      request.succeed(events);
      MockPromises.executeForResolvedPromises();
    });

    it('updates the data', function() {
      expect(eventDataCallbackSpy).toHaveBeenCalledWith(events);
    });
  });
});