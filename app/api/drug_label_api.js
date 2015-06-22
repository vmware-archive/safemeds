var request = require('superagent');

var baseApiUrl;

var FdaApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  search(options) {
    var {name} = options

    return new Promise(function (resolve, reject) {
      request.get(`${baseApiUrl}/drug/label.json`, {
        search: `openfda.generic_name:${name}+openfda.brand_name:${name}`
      })
        .end(function (err, res) {
          if (err || !res.ok) return reject(err);
          resolve(res.body);
        });
    });
  }
};

module.exports = FdaApi;