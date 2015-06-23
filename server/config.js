try {
  var localConfig = process.env.NODE_ENV !== 'production' ? require('../config/secret.json') : {};
} catch(e) {
  localConfig = {};
}

try {
  var secret = require('../config/secret.json');
} catch(e) {
  secret = {};
}

var config = Object.assign({
  baseApiUrl: process.env.BASE_API_URL || '/api',
  apiKey: process.env.API_KEY || ''
}, require('../config/application.json'), require(`../config/${process.env.NODE_ENV}.json`), localConfig, secret);
module.exports = config;