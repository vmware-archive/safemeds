var {isServer} = require('../helpers/application_helper');
const BREAK_WIDTH = 750;

var ResponsiveMixin = {
  statics: {
    BREAK_WIDTH
  },

  isDesktop() {
    if (isServer()) return true;
    var {matches} = safemeds.matchMedia.call(window, `(max-width: ${BREAK_WIDTH}px)`);
    return !matches;
  }
};

module.exports = ResponsiveMixin;