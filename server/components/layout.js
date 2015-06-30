var React = require('react/addons');

var types = React.PropTypes;

var Body = React.createClass({
  propTypes: {
    config: types.object.isRequired,
    data: types.object.isRequired,
    entry: types.func.isRequired,
    scripts: types.array.isRequired
  },

  render() {
    var {data, config, entry, scripts, className} = this.props;
    scripts = scripts.map(function(src, i) {
      return (<script type="text/javascript" src={src} key={i}/>);
    });
    var entryFactory = React.createFactory(entry);
    var __html = React.renderToString(entryFactory({config, data}));
    var configScript = `var safemeds = {config: ${JSON.stringify(config)}, data: ${JSON.stringify(data)}, animation: true, Promise: Promise, matchMedia: matchMedia};`;
    return (
      <body className={className}>
        <div id="root" dangerouslySetInnerHTML={{__html}}/>
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: configScript}}/>
        {scripts}
      </body>
    );
  }
});

var Layout = React.createClass({
  propTypes: {
    config: types.object,
    data: types.object.isRequired,
    entry: types.func.isRequired,
    stylesheets: types.array.isRequired,
    scripts: types.array.isRequired
  },

  statics: {
    init(Entry) {
      if (typeof document === 'undefined') return;
      var {config, data} = safemeds;
      React.render(<Entry {...{config, data}}/>, root);
    }
  },

  render() {
    var {stylesheets} = this.props;

    stylesheets = stylesheets.map(function(href, i) {
      return (<link rel="stylesheet" type="text/css" href={href} key={i}/>);
    });

    return (
      <html>
        <head>
          {stylesheets}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </head>
        <Body {...this.props}/>
      </html>
    );
  }
});

module.exports = Layout;