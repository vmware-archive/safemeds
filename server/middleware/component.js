var {assetPath} = require('../helpers/asset_helper');
var Layout = require('../components/layout');
var React = require('react/addons');

var config = require('../config');

function show(entry, entryName) {
  function renderComponent(req, res) {
    var stylesheets = ['components.css', `${entryName}.css`].map(assetPath);
    var scripts = [`react-${React.version}.js`, `${entryName}.js`].map(assetPath);
    var {id: appId = null} = req.params;
    var data = {appId};
    var props = {config, data, entry, scripts, stylesheets};
    var html = React.renderToStaticMarkup(<Layout {...props}/>);
    res
      .type('html')
      .status(200)
      .send(`<!DOCTYPE html>${html}`);
  }

  return [renderComponent];
}

module.exports = {show};