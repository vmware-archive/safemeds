var request = require('superagent');

var baseApiUrl;
var apiKey;

var DrugLabelApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  get apiKey() { return apiKey; },

  set apiKey(u) { apiKey = u; },

  search(options = {}) {
    var {name, limit, exact} = options;

    var params = {};

    if (name) {
      params.search = DrugLabelApi._searchParam(name);
    }

    return new Promise(function (resolve, reject) {
      DrugLabelApi._makeRequest({
        params: params,
        resolve: DrugLabelApi._processResults(name, exact, limit, resolve),
        reject: reject
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
          return result.length;
        });

        if (!drugInQuestionResponse.length || !results.length) {
          var error = new Error('Drug In Question Not Found');
          error.drug = drugInQuestion;
          reject(error);
        }

        results.forEach(function (resp, index) {
          var result = {existingDrug: {}, drugInQuestion: {}};

          resp.forEach(function(response) {
            drugInQuestionResponse.forEach(function (drugInQuestionDrugLabel) {
              var fieldsToCompare = ['warnings', 'drug_interactions', 'spl_medguide', 'contraindications'];

              fieldsToCompare.forEach(function(field) {
                var highlights = DrugLabelApi._labelValueHighlights(response[field], drugInQuestionDrugLabel);
                if (highlights) {
                  result.existingDrug[field] = {
                    text: response[field],
                    highlights: highlights
                  };
                }

                highlights = DrugLabelApi._labelValueHighlights(drugInQuestionDrugLabel[field], response);
                if (highlights) {
                  result.drugInQuestion[field] = {
                    text: drugInQuestionDrugLabel[field],
                    highlights: highlights
                  };
                }
              });
            });

            if(Object.keys(result.drugInQuestion).length || Object.keys(result.existingDrug).length) {
              comparisonResults[drugCollection[index]] = result;
            }
          });
        });
        resolve(comparisonResults);
      }, reject);
    });
  },

  _makeRequest(options) {
    var {params, results, resultLimit, resolve, reject} = options;
    params.skip = params.skip || 0;
    params.limit = params.limit || 100;

    results = results || [];

    request.get(DrugLabelApi._constructUrl(params))
      .end(function (err, res) {
        if (err || !res.ok) {
          if (res && res.status === 404) {
            return resolve([]);
          } else {
            return reject(err);
          }
        }
        results = results.concat(res.body.results);

        var numbers = res.body.meta.results;
        var resultsFound = numbers.skip + numbers.limit;
        if (resultsFound < numbers.total
              && resultsFound < 5 * numbers.limit
              && (!resultLimit || resultsFound < resultLimit)) {
          params.skip = params.skip + params.limit;
          return DrugLabelApi._makeRequest({
            params: params,
            results: results,
            resultLimit: resultLimit,
            resolve: resolve,
            reject: reject
          });
        } else {
          resolve(results);
        }
      });
  },

  _constructUrl(params) {
    if (apiKey) {
      params.api_key = encodeURIComponent(apiKey);
    }

    var paramsArray = Object.keys(params).map(function(key) {
      return `${key}=${params[key]}`;
    });
    return `${baseApiUrl}/drug/label.json?${paramsArray.join('&')}`;
  },

  _searchParam(name, exact=false) {
    var specialCharacters = /[,'/%]/g;
    var exactString = exact ? '.exact' : '';

    if (name.match(specialCharacters)) {
      name = name.replace(specialCharacters, '');
      exactString = '';
    }

    return `openfda.generic_name${exactString}:"${encodeURIComponent(name)}"+openfda.brand_name${exactString}:"${encodeURIComponent(name)}"`;
  },

  _labelValueHighlights(valueList, drugLabel) {
    if(!valueList) {
      return false;
    }

    var highlights = valueList.map(function(value) {
      value = value.toLowerCase();
      var highlightList = [];

      var names = DrugLabelApi._lowerNamesForLabel(drugLabel.openfda.generic_name);
      names.forEach(function(name) {
        var index, offset = 0;
        while (index !== -1) {
          index = value.indexOf(name, offset);
          if(index !== -1) {
            highlightList.push({start: index, length: name.length});
          }
          offset = index + name.length;
        }
      });
      return (highlightList.length) ? highlightList : null;
    }).filter(function(val) { return val; });

    if(highlights.length) {
      return highlights;
    }
    return false;
  },

  _fetchDrugLabelsForName(name) {
    return new Promise(function(resolve, reject) {
      DrugLabelApi._makeRequest({
        params: {search: DrugLabelApi._searchParam(name, true)},
        resultLimit: 100,
        resolve: resolve,
        reject: reject
      });
    });
  },

  _lowerNamesForLabel(generic_names, brand_names) {
    var names = [].concat(generic_names, brand_names);
    names = names.filter(function(val) { return val; });
    return names.map(function(name) { return name.toLowerCase(); });
  },

  _sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9 ]/g, '');
  },

  _processResults(name, exact, limit, resolve) {
    return function(results) {
      if (exact) {
       results = results.filter(function(value) {
          var lowerCaseName = name.toLowerCase();
          var names = DrugLabelApi._lowerNamesForLabel(value.openfda.generic_name, value.openfda.brand_name);

          return names.some(function(name) {
            return DrugLabelApi._sanitizeName(name) === DrugLabelApi._sanitizeName(lowerCaseName);
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
