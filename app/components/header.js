var React = require('react/addons');
var {Icon} = require('pui-react-iconography');
var Svg = require('./svg');

var Header = React.createClass({
  render() {
    return (
      <div>
        <header>
          <Svg className="logo" src="logo"/>
        </header>

        <h1 className="tagline">
          <span className="before">Know the effects</span>
          <span className="separator"><Icon name="angle-right"/></span>
          <span className="after">before you ingest.</span>
        </h1>
      </div>
    );
  }

});

module.exports = Header;