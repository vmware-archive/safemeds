function waitForRelatedTarget() {
  return new Promise(function(resolve) {
    setImmediate(() => {
      resolve(document.activeElement);
    });
  });
}

module.exports = {
  withRelatedTarget(callback) {
    return async function(e) {
      if (!e.relatedTarget) {
        e = {relatedTarget: await waitForRelatedTarget.call(this), ...e};
      }
      return callback.call(this, e);
    };
  }
};