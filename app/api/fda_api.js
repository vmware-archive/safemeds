var request = require('superagent');

var baseApiUrl;

var FdaApi = {
  get baseApiUrl() { return baseApiUrl; },

  set baseApiUrl(u) { baseApiUrl = u; },

  events() {
    return new Promise(function(resolve, reject) {
      request.get(`${baseApiUrl}/drug/event.json`)
        .end(function(err, res) {
          if (err || !res.ok) return reject(err);
          resolve(res.body);
        });
    });
  }
};

module.exports = FdaApi;