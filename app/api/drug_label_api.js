var request = require('superagent');

var baseApiUrl;

var FdaApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  _makeRequest(params, results, resolve, reject) {
    request.get(FdaApi._constructUrl(params))
      .end(function (err, res) {
        if (err || !res.ok) return reject(err);
        results = results.concat(res.body.results);

        var numbers = res.body.meta.results;
        if (numbers.skip + numbers.limit < numbers.total) {
          params.skip = params.skip + params.limit;
          return FdaApi._makeRequest(params, results, resolve);
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

  search(options = {}) {
    var {name} = options;
    var results = [];

    var params = {
      skip: 0,
      limit: 50
    };
    if (name) {
      params.search = `openfda.generic_name:${encodeURIComponent(name)}+openfda.brand_name:${encodeURIComponent(name)}`;
    }

    return new Promise(function (resolve, reject) {
      FdaApi._makeRequest(params, results, resolve, reject);
    });
  }
};

module.exports = FdaApi;
