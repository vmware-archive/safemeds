try {
  var localConfig = process.env.NODE_ENV !== 'production' ? require('../config/local.json') : {};
} catch(e) {
  localConfig = {};
}

var config = Object.assign({
  baseApiUrl: process.env.BASE_API_URL || '/api',
  uaaUrl: process.env.UAA_URL || '/',
  cloudControllerUrl: process.env.CLOUD_CONTROLLER_URL || '/cloud_controller'
}, require('../config/application.json'), require(`../config/${process.env.NODE_ENV}.json`), localConfig);
module.exports = config;