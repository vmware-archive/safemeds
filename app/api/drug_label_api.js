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
    var {brand_name} = drugLabel.openfda;
    var {generic_name} = drugLabel.openfda;

    return valueList.some(function(value) {
      return value.includes(brand_name) || value.includes(generic_name);
    });
  },

  compareDrugs(drugInQuestion, drugCollection) {
    return new Promise(function(resolve) {
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
              if (DrugLabelApi._labelValueContainsDrugName(response.warnings, drugInQuestionDrugLabel)) {
                result.existingDrug.warnings = response.warnings;
              }

              if (DrugLabelApi._labelValueContainsDrugName(response.drug_interactions, drugInQuestionDrugLabel)) {
                result.existingDrug.drug_interactions = response.drug_interactions;
              }

              if (DrugLabelApi._labelValueContainsDrugName(drugInQuestionDrugLabel.warnings, response)) {
                result.drugInQuestion.warnings = drugInQuestionDrugLabel.warnings;
              }

              if (DrugLabelApi._labelValueContainsDrugName(drugInQuestionDrugLabel.drug_interactions, response)) {
                result.drugInQuestion.drug_interactions = drugInQuestionDrugLabel.drug_interactions;
              }
            });

            comparisonResults[drugCollection[index]] = result;
          });
        });

        resolve(comparisonResults);
      });
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
    var {name} = options;
    var {limit} = options;
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
      DrugLabelApi._makeRequest(params, results, limit, resolve, reject);
    });
  }
};

module.exports = DrugLabelApi;
