var {assetPath} = require('../helpers/asset_helper');
var Layout = require('../components/layout');
var React = require('react/addons');

var config = require('../config');
var drugNames = require('../../config/drug_names.json');

function show(entry, entryName) {
  function renderComponent(req, res) {
    var stylesheets = ['components.css', `${entryName}.css`].map(assetPath);
    var scripts = [`react-${React.version}.js`, `fastclick.js`, `${entryName}.js`].map(assetPath);
    var data = {drugNames};
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