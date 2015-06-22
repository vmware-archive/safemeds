require('../spec_helper');

describe('FdaApi', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/api/fda_api');
  });

  describe('#stuff', function() {
    var doneSpy, failSpy, request;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      failSpy = jasmine.createSpy('fail');
      subject.stuff().then(doneSpy, failSpy);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('does stuff', function() {
      expect('fda.gov/drugs').toHaveBeenRequested();
    });

    describe('when the request is successful', function() {
      beforeEach(function() {
        request.succeed([{foo: 'bar'}]);
        MockPromises.executeForResolvedPromises();
      });

      it('resolves the promise', function() {
        expect(doneSpy).toHaveBeenCalledWith([{foo: 'bar'}]);
      });
    });

    describe('when the request is not successful', function() {
      beforeEach(function() {
        request.respondWith({status: 500});
        MockPromises.executeForResolvedPromises();
      });

      it('rejects the promise', function() {
        expect(failSpy).toHaveBeenCalled();
      });
    });
  });
});