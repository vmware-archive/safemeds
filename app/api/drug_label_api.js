var request = require('superagent');

var baseApiUrl;
var apiKey;

var DrugLabelApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  get apiKey() { return apiKey; },

  set apiKey(u) { apiKey = u; },

  _makeRequest(params, results, resolve, reject) {
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
        if (resultsFound < numbers.total) {
          params.skip = params.skip + params.limit;
          return DrugLabelApi._makeRequest(params, results, resolve, reject);
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

    return valueList.some(function(value) {
      value = value.toLowerCase();

      var names = DrugLabelApi._lowerNamesForLabel(drugLabel);
      return names.some(function(name) {
        return value.includes(name);
      });
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

        results = results.filter(function(result) {
          return result !== null;
        });

        if (drugInQuestionResponse === null || results.length < 1) {
          reject(new Error('Drug In Question Not Found'));
        }

        results.forEach(function (resp, index) {
          var result = {existingDrug: {}, drugInQuestion: {}};

          resp.results.forEach(function(response) {
            drugInQuestionResponse.results.forEach(function (drugInQuestionDrugLabel) {
              var fieldsToCompare = ['warnings', 'drug_interactions', 'spl_medguide'];

              fieldsToCompare.forEach(function(field) {
                if (DrugLabelApi._labelValueContainsDrugName(response[field], drugInQuestionDrugLabel)) {
                  result.existingDrug[field] = {
                    text: response[field]
                  };
                }

                if (DrugLabelApi._labelValueContainsDrugName(drugInQuestionDrugLabel[field], response)) {
                  result.drugInQuestion[field] = {
                    text: drugInQuestionDrugLabel[field]
                  };
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
            return resolve(null);
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

    var pageSize = 50;

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
      DrugLabelApi._makeRequest(params, results, DrugLabelApi._processResults(name, exact, limit, resolve), reject);
    });
  },

  _lowerNamesForLabel(label) {
    var names = [].concat(label.openfda.brand_name, label.openfda.generic_name);
    names = names.filter(function(val) { return val; });
    return names.map(function(name) { return name.toLowerCase(); });
  },

  _processResults(name, exact, limit, resolve) {
    return function(results) {
      if (exact) {
       results = results.filter(function(value) {
          var lowerCaseName = name.toLowerCase();
          var names = DrugLabelApi._lowerNamesForLabel(value);

          return names.some(function(name) {
            return name === lowerCaseName;
          });
        });
      }

      if (limit) {
        results = results.slice(0, limit);
      }

      resolve(results);
    };
  }
};



module.exports = DrugLabelApi;
