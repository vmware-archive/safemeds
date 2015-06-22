require('../spec_helper');

describe('DrugLabelApi', function() {
  const baseApiUrl = 'api.fda.gov';
  var subject, qs;

  beforeEach(function() {
    subject = require('../../../app/api/drug_label_api');
    qs = require('qs');
    subject.baseApiUrl = baseApiUrl;
  });

  describe('#search', function() {
    var doneSpy, failSpy, request;
    var options = {};

    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      failSpy = jasmine.createSpy('fail');

      subject.search(options).then(doneSpy, failSpy);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('fetches data for the label', function() {
      expect(`${baseApiUrl}/drug/label.json`).toHaveBeenRequested();
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

    describe('when searching by name', function() {
      const drug = 'my-drug';
      options = {name: drug};

      it('fetches the data with a search query parameter', function() {
        var search = qs.stringify({
          search: `openfda.generic_name:${drug}+openfda.brand_name:${drug}`
        });

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${search}`);
      });
    });
  });
});