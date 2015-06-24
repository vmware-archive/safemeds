var request = require('superagent');

var baseApiUrl;
var apiKey;

var DrugLabelApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  get apiKey() { return apiKey; },

  set apiKey(u) { apiKey = u; },

  _makeRequest(params, results, limit, resolve, reject) {
    request.get(DrugLabelApi._constructUrl(params))
      .end(function (err, res) {
        if (err || !res.ok) {
          if (res.status === 404) {
            return resolve([]);
          } else {
            return reject(err);
          }
        }
        results = results.concat(res.body.results);

        var numbers = res.body.meta.results;
        var resultsFound = numbers.skip + numbers.limit;
        if ((resultsFound < numbers.total) && (!limit || resultsFound < limit)) {
          params.skip = params.skip + params.limit;
          if (params.limit + params.skip > limit) {
            params.limit = limit - params.skip;
          }
          return DrugLabelApi._makeRequest(params, results, limit, resolve, reject);
        } else {
          resolve(results);
        }
      });
  },

  _constructUrl(params) {
    var paramsArray = Object.keys(params).map(function(key) {
      return `${key}=${params[key]}`;
    });
    return `${baseApiUrl}/drug/label.json?${paramsArray.join('&')}`;
  },

  _searchParam(name, exact=false) {
    var exactString = exact ? '.exact' : '';
    return `openfda.generic_name${exactString}:${encodeURIComponent(name)}+openfda.brand_name${exactString}:${encodeURIComponent(name)}`;
  },

  _labelValueContainsDrugName(valueList, drugLabel) {
    if(!valueList) {
      return false;
    }
    var {brand_name, generic_name} = drugLabel.openfda;

    return valueList.some(function(value) {
      value = value.toLowerCase();
      brand_name = (brand_name) ? brand_name.toLowerCase() : null;
      generic_name = (generic_name) ? generic_name.toLowerCase() : null;
      return value.includes(brand_name) ||
        value.includes(generic_name);
    });
  },

  compareDrugs(drugInQuestion, drugCollection) {
    return new Promise(function(resolve, reject) {
      var promises = [DrugLabelApi._fetchDrugLabelsForName(drugInQuestion)];

      drugCollection.forEach(function(name) {
        promises.push(DrugLabelApi._fetchDrugLabelsForName(name));
      });

      Promise.all(promises).then(function(results) {
        var comparisonResults = {};
        var drugInQuestionResponse = results.shift();
        results.forEach(function (resp, index) {
          var result = {existingDrug: {}, drugInQuestion: {}};

          resp.results.forEach(function(response) {
            drugInQuestionResponse.results.forEach(function (drugInQuestionDrugLabel) {
              var fieldsToCompare = ['warnings', 'drug_interactions', 'spl_medguide'];

              fieldsToCompare.forEach(function(field) {
                if (DrugLabelApi._labelValueContainsDrugName(response[field], drugInQuestionDrugLabel)) {
                  result.existingDrug[field] = response[field];
                }

                if (DrugLabelApi._labelValueContainsDrugName(drugInQuestionDrugLabel[field], response)) {
                  result.drugInQuestion[field] = drugInQuestionDrugLabel[field];
                }
              });
            });

            comparisonResults[drugCollection[index]] = result;
          });
        });

        resolve(comparisonResults);
      }, reject);
    });
  },

  _fetchDrugLabelsForName(name) {
    return new Promise(function(resolve, reject) {
      var params = {
        limit: 100,
        search: DrugLabelApi._searchParam(name, true)
      };
      request.get(DrugLabelApi._constructUrl(params)).end(function(err, res) {
        if (err || !res.ok) {
          if (res.status === 404) {
            return resolve([]);
          } else {
            return reject(err);
          }
        }
        resolve(res.body);
      });
    });
  },

  search(options = {}) {
    var {name, limit, exact} = options;
    var results = [];

    var pageSize = (limit < 50) ? limit : 50;

    var params = {
      skip: 0,
      limit: pageSize
    };

    if (apiKey) {
      params.api_key = encodeURIComponent(apiKey);
    }

    if (name) {
      params.search = DrugLabelApi._searchParam(name);
    }

    return new Promise(function (resolve, reject) {
      DrugLabelApi._makeRequest(params, results, limit, DrugLabelApi._processResults(name, exact, resolve), reject);
    });
  },

  _processResults(name, exact, resolve) {
    return function(results) {
      if (exact) {
        resolve(results.filter(function(value) {
          var matched = false;
          var lowercaseName = name.toLowerCase();
          if (value.openfda.generic_name && value.openfda.generic_name.toLowerCase() === lowercaseName) {
            matched = true;
          }

          if (value.openfda.brand_name && value.openfda.brand_name.toLowerCase() === lowercaseName) {
            matched = true;
          }

          return matched;
        }));
      } else {
        resolve(results);
      }
    };
  }
};



module.exports = DrugLabelApi;
