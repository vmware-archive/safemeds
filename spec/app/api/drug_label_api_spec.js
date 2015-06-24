require('../spec_helper');

describe('DrugLabelApi', function() {
  const baseApiUrl = 'api.fda.gov';
  const apiKey = 'i am an api key';
  var subject, qs;
  var doneSpy, failSpy;
  var pagination;

  beforeEach(function() {
    subject = require('../../../app/api/drug_label_api');
    qs = require('qs');
    subject.baseApiUrl = baseApiUrl;

    doneSpy = jasmine.createSpy('done');
    failSpy = jasmine.createSpy('fail');
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
    var request;

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

      describe('when an exact match is specified', function() {
        it('rejects any results that do not have the exact string', function() {
          request = performRequest({name: 'my-drug', exact: true});
          var drugLabels = [
            Factory.build('drugLabel', {
              openfda: {generic_name: ['my-drug pm']}
            }),
            Factory.build('drugLabel', {
              openfda: {generic_name: ['my-drUG']}
            }),
            Factory.build('drugLabel', {
              openfda: {brand_name: ['super my-drug']}
            }),
            Factory.build('drugLabel', {
              openfda: {brand_name: ['my-DRug']}
            })
          ];
          request.succeed(makeResponse(drugLabels, 0, 50, 4));
          MockPromises.executeForResolvedPromises();

          expect(doneSpy).toHaveBeenCalledWith([drugLabels[1], drugLabels[3]]);
        });
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

  describe('#compare', function() {
    beforeEach(function() {
      pagination = qs.stringify({
        limit: 100
      });
    });

    it('compares the drugs provided', function() {
      subject.compareDrugs('drug1', ['drug2', 'drug3']).then(doneSpy, failSpy);

      var firstRequest = jasmine.Ajax.requests.at(0);
      var secondRequest = jasmine.Ajax.requests.at(1);
      var thirdRequest = jasmine.Ajax.requests.at(2);

      var firstSearch = `search=openfda.generic_name.exact:drug1+openfda.brand_name.exact:drug1`;
      expect(firstRequest.url).toEqual(`${baseApiUrl}/drug/label.json?${pagination}&${firstSearch}`);

      var secondSearch = `search=openfda.generic_name.exact:drug2+openfda.brand_name.exact:drug2`;
      expect(secondRequest.url).toEqual(`${baseApiUrl}/drug/label.json?${pagination}&${secondSearch}`);

      var thirdSearch = `search=openfda.generic_name.exact:drug3+openfda.brand_name.exact:drug3`;
      expect(thirdRequest.url).toEqual(`${baseApiUrl}/drug/label.json?${pagination}&${thirdSearch}`);

      firstRequest.succeed(makeResponse([Factory.build('drugLabel', {
        openfda: {generic_name: ['drug1']},
        drug_interactions: ['drug2 is fatal, science soundy named drug might be bad'],
        warnings: ['drug2 may cause death, take with caution'],
        spl_medguide: ['jim was here HAGgel flagel dRUG2']
      })]));
      MockPromises.executeForResolvedPromises();

      secondRequest.succeed(makeResponse([Factory.build('drugLabel', {
        openfda: {generic_name: ['drug2']},
        warnings: ['do not take with drug1'],
        drug_interactions: ['drug1 will cause spontaneous combustion'],
        spl_medguide: ['IF THIS CODE DOES NOT GET PUSHED JOSEPH IS FIRED DRUG1']
      })]));

      thirdRequest.succeed(makeResponse([Factory.build('drugLabel', {
        openfda: {
          generic_name: ['science soundy named drug'],
          brand_name: ['drug3']
        }
      })]));
      MockPromises.executeForResolvedPromises();
      MockPromises.executeForResolvedPromises();
      MockPromises.executeForResolvedPromises();

      expect(failSpy).not.toHaveBeenCalled();
      expect(doneSpy).toHaveBeenCalledWith({
        drug2: {
          drugInQuestion: {
            drug_interactions: ['drug2 is fatal, science soundy named drug might be bad'],
            warnings: ['drug2 may cause death, take with caution'],
            spl_medguide: ['jim was here HAGgel flagel dRUG2']
          },
          existingDrug: {
            drug_interactions: ['drug1 will cause spontaneous combustion'],
            spl_medguide: ['IF THIS CODE DOES NOT GET PUSHED JOSEPH IS FIRED DRUG1'],
            warnings: ['do not take with drug1']
          }
        },
        drug3: {
          drugInQuestion: {
            drug_interactions: ['drug2 is fatal, science soundy named drug might be bad']
          },
          existingDrug: {}
        }
      });
    });

    it('compares the all drugs when multiple are returned', function() {
      subject.compareDrugs('drug1', ['drug2']).then(doneSpy, failSpy);

      var firstRequest = jasmine.Ajax.requests.at(0);
      var secondRequest = jasmine.Ajax.requests.at(1);

      firstRequest.succeed(makeResponse([
        Factory.build('drugLabel', {
          openfda: {generic_name: ['drug1']},
          drug_interactions: ['drug2 is fatal']
        }),
        Factory.build('drugLabel', {
          openfda: {brand_name: ['drug1']},
          warnings: ['drug2 may cause death, take with caution']
        })
      ]));
      MockPromises.executeForResolvedPromises();

      secondRequest.succeed(makeResponse([
        Factory.build('drugLabel', {
          openfda: {generic_name: ['drug2']},
          warnings: ['do not take with drug1'],
          drug_interactions: ['garbage drug may not kill you']
        }),
        Factory.build('drugLabel', {
          openfda: {brand_name: ['drug2']},
          warnings: ['something something drug1'],
          drug_interactions: ['drug1 will cause spontaneous combustion']
        })
      ]));

      MockPromises.executeForResolvedPromises();
      MockPromises.executeForResolvedPromises();
      MockPromises.executeForResolvedPromises();

      expect(failSpy).not.toHaveBeenCalled();

      expect(doneSpy).toHaveBeenCalledWith({
        drug2: {
          drugInQuestion: {
            drug_interactions: ['drug2 is fatal'],
            warnings: ['drug2 may cause death, take with caution']
          },
          existingDrug: {
            drug_interactions: ['drug1 will cause spontaneous combustion'],
            warnings: ['something something drug1']
          }
        }
      });
    });

    describe('when fetching drugs fail', function() {
      describe('when the drug in question fails', function() {
        describe('when the error code is a 500', function() {
          it('calls the failure callback', function() {
            subject.compareDrugs('drug1', ['drug2']).then(doneSpy, failSpy);

            var firstRequest = jasmine.Ajax.requests.at(0);
            var secondRequest = jasmine.Ajax.requests.at(1);

            firstRequest.respondWith({status: 500});
            MockPromises.executeForResolvedPromises();

            secondRequest.succeed({});
            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();

            expect(failSpy).toHaveBeenCalled();
          });
        });
      });

      describe('when the error code is a 404', function() {
        describe('when the drugInQuestion is missing', function() {
          it('calls the failure callback', function() {
            subject.compareDrugs('drug1', ['drug2']).then(doneSpy, failSpy);

            var firstRequest = jasmine.Ajax.requests.at(0);
            var secondRequest = jasmine.Ajax.requests.at(1);

            firstRequest.respondWith({status: 404});
            MockPromises.executeForResolvedPromises();

            secondRequest.succeed(makeResponse([Factory.build('drugLabel')]));
            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();

            expect(failSpy).toHaveBeenCalled();
          });
        });

        describe('when other drugs are missing', function() {
          it('calls the failure callback', function() {
            subject.compareDrugs('drug1', ['drug2']).then(doneSpy, failSpy);

            var firstRequest = jasmine.Ajax.requests.at(0);
            var secondRequest = jasmine.Ajax.requests.at(1);

            firstRequest.succeed(makeResponse([Factory.build('drugLabel')]));

            secondRequest.respondWith({status: 404});
            MockPromises.executeForResolvedPromises();

            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();

            expect(failSpy).toHaveBeenCalled();
          });
        });

        describe('when some of the other drugs are missing', function() {
          it('calls the success callback', function() {
            subject.compareDrugs('drug1', ['drug2', 'drug3']).then(doneSpy, failSpy);

            var firstRequest = jasmine.Ajax.requests.at(0);
            var secondRequest = jasmine.Ajax.requests.at(1);
            var thirdRequest = jasmine.Ajax.requests.at(2);

            firstRequest.succeed(makeResponse([Factory.build('drugLabel')]));

            secondRequest.respondWith({status: 404});
            MockPromises.executeForResolvedPromises();

            thirdRequest.succeed(makeResponse([Factory.build('drugLabel')]));
            MockPromises.executeForResolvedPromises();

            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();
            MockPromises.executeForResolvedPromises();

            expect(failSpy).not.toHaveBeenCalled();
            expect(doneSpy).toHaveBeenCalled();
          });
        });
      });

      describe('when its not the drug in question that fails', function() {
        it('calls the failure callback when the drug in question fails', function() {
          subject.compareDrugs('drug1', ['drug2']).then(doneSpy, failSpy);

          var firstRequest = jasmine.Ajax.requests.at(0);
          var secondRequest = jasmine.Ajax.requests.at(1);

          firstRequest.succeed({});
          MockPromises.executeForResolvedPromises();

          secondRequest.respondWith({status: 500});
          MockPromises.executeForResolvedPromises();
          MockPromises.executeForResolvedPromises();
          MockPromises.executeForResolvedPromises();

          expect(failSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
