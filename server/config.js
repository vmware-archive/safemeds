try {
  var localConfig = process.env.NODE_ENV !== 'production' ? require('../config/local.json') : {};
} catch(e) {
  localConfig = {};
}

var config = Object.assign({
  baseApiUrl: process.env.BASE_API_URL || '/api'
}, require('../config/application.json'), require(`../config/${process.env.NODE_ENV}.json`), localConfig);
module.exports = config;