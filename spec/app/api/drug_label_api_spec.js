require('../spec_helper');

describe('DrugLabelApi', function() {
  const baseApiUrl = 'api.fda.gov';
  var subject, qs;

  beforeEach(function() {
    subject = require('../../../app/api/drug_label_api');
    qs = require('qs');
    subject.baseApiUrl = baseApiUrl;
  });

  function makeResponse(results, skip = 0, limit = 50, total = 1) {
    return {
      meta: {
        results: {
          skip: skip,
          limit: limit,
          total: total
        }
      },
      results: results
    };
  }

  describe('#search', function() {
    var doneSpy, failSpy, request;
    var pagination;

    function performRequest(options) {
      subject.search(options).then(doneSpy, failSpy);
      return jasmine.Ajax.requests.mostRecent();
    }

    beforeEach(function() {
      request = null;

      pagination = qs.stringify({
        skip: 0,
        limit: 50
      });

      doneSpy = jasmine.createSpy('done');
      failSpy = jasmine.createSpy('fail');
    });

    it('fetches data for the label', function() {
      request = performRequest();
      expect(request.url).toEqual(`${baseApiUrl}/drug/label.json?${pagination}`);
    });

    describe('when the request is successful', function() {
      beforeEach(function() {
        request = performRequest();
        request.succeed(makeResponse([{foo: 'bar'}]));
        MockPromises.executeForResolvedPromises();
      });

      it('resolves the promise', function() {
        expect(doneSpy).toHaveBeenCalledWith([{foo: 'bar'}]);
      });
    });

    describe('when there are multiple pages of results', function() {
      var secondRequest;

      beforeEach(function () {
        request = performRequest();
        request.succeed({
          meta: {
            results: {
              skip: 0,
              limit: 50,
              total: 75
            }
          },
          results: [
            {
              foo: 'bar1'
            }
          ]
        });
        MockPromises.executeForResolvedPromises();

        secondRequest = jasmine.Ajax.requests.mostRecent();
        secondRequest.succeed({
          meta: {
            results: {
              skip: 50,
              limit: 50,
              total: 75
            }
          },
          results: [
            {
              foo: 'bar2'
            }
          ]
        });

        MockPromises.executeForResolvedPromises();
        MockPromises.executeForResolvedPromises();
      });

      describe('when the request has multiple pages', function() {
        it('fetches all of the data', function() {
          var pagination = qs.stringify({
            skip: 50,
            limit: 50
          });

          expect(secondRequest.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}`);
          expect(doneSpy).toHaveBeenCalledWith([{foo: 'bar1'}, {foo: 'bar2'}]);
        });
      });
    });

    describe('when the request is not successful', function() {
      beforeEach(function() {
        request = performRequest();
        request.respondWith({status: 500});
        MockPromises.executeForResolvedPromises();
      });

      it('rejects the promise', function() {
        expect(failSpy).toHaveBeenCalled();
      });
    });

    describe('when searching by name', function() {
      const drug = 'my-drug';

      it('fetches the data with a search query parameter', function() {
        request = performRequest({name: drug});
        var search = qs.stringify({
          search: `openfda.generic_name:${drug}+openfda.brand_name:${drug}`
        });

        expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}&${search}`);
      });
    });
  });
});