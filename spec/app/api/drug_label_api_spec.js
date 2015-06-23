require('../spec_helper');

describe('DrugLabelApi', function() {
  const baseApiUrl = 'api.fda.gov';
  const apiKey = 'i am an api key';
  var subject, qs;

  beforeEach(function() {
    subject = require('../../../app/api/drug_label_api');
    qs = require('qs');
    subject.baseApiUrl = baseApiUrl;
  });

  afterEach(function() {
    subject.apiKey = null;
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

  it('sets the api key and base api url', function() {
    subject.apiKey = apiKey;

    expect(subject.baseApiUrl).toEqual(baseApiUrl);
    expect(subject.apiKey).toEqual(apiKey);
  });

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
      it('rejects the promise on a 500', function() {
        request = performRequest();
        request.respondWith({status: 500});
        MockPromises.executeForResolvedPromises();
        expect(failSpy).toHaveBeenCalled();
      });

      it('returns an empty array on a 404', function() {
        request = performRequest();
        request.respondWith({status: 404});
        MockPromises.executeForResolvedPromises();

        expect(doneSpy).toHaveBeenCalledWith([]);
      });
    });

    describe('when searching by name', function() {
      const drug = 'my-drug';

      it('fetches the data with a search query parameter', function() {
        request = performRequest({name: drug});
        var search = `search=openfda.generic_name:${drug}+openfda.brand_name:${drug}`;

        expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}&${search}`);
      });

      it('escapes special characters', function() {
        request = performRequest({name: 'drugs+to+find'});
        var search = `search=openfda.generic_name:drugs%2Bto%2Bfind+openfda.brand_name:drugs%2Bto%2Bfind`;
        expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}&${search}`);
      });
    });

    describe('when the api key is set', function() {
      it('sets the api key url parameter', function() {
        subject.apiKey = apiKey;
        request = performRequest();

        var authKey = qs.stringify({
          api_key: apiKey
        });

        expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}&${authKey}`);
      });
    });

    describe('when a limit is specified', function() {
      describe('when the limit is less than 50', function() {
        it('sets the page size to their limit and only fetches the first page', function() {
          pagination = qs.stringify({
            skip: 0,
            limit: 2
          });

          request = performRequest({limit: 2});

          expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}`);

          request.succeed(makeResponse([{foo: 'bar1'}, {foo: 'bar2'}], 0, 2, 100));
          MockPromises.executeForResolvedPromises();

          expect(doneSpy).toHaveBeenCalled();
        });
      });

      describe('when the limit is greater than 50', function() {
        it('fetches 50 at a time, but returns only the number requested', function() {
          pagination = qs.stringify({
            skip: 0,
            limit: 50
          });

          request = performRequest({limit: 55});
          expect(request.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}`);
          request.succeed(makeResponse([{foo: 'bar1'}, {foo: 'bar2'}], 0, 50, 100));
          MockPromises.executeForResolvedPromises();

          pagination = qs.stringify({
            skip: 50,
            limit: 5
          });

          var secondRequest = jasmine.Ajax.requests.mostRecent();
          expect(secondRequest.url).toEqual(`${baseApiUrl}/drug/label.json\?${pagination}`);
          secondRequest.succeed(makeResponse([{foo: 'bar1'}, {foo: 'bar2'}], 50, 5, 100));
          MockPromises.executeForResolvedPromises();

          expect(doneSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
