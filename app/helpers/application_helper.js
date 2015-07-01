var ApplicationHelper = {
  isFunction(obj) {
    return typeof obj === 'function';
  },

  isServer() {
    return typeof document === 'undefined';
  },

  isClient() {
    return !ApplicationHelper.isServer();
  },

  result(obj) {
    return ApplicationHelper.isFunction(obj) ? obj.call(this) : obj;
  }
};

module.exports = ApplicationHelper;