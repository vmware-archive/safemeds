var request = require('superagent');

var baseApiUrl = 'https://fda.gov';

var FdaApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  stuff(options = {}) {
    return new Promise(function(resolve, reject) {
      request.get(`${baseApiUrl}/drugs`)
        .end(function(err, res) {
          if (err || !res.ok) return reject(err);
          resolve(res.body);
        });
    });
  }
};

module.exports = FdaApi;