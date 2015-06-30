var Circle = require('./circle');
var {Icon} = require('pui-react-iconography');
var React = require('react/addons');
var Svg = require('./svg');

var types = React.PropTypes;

var DrugsLayout = React.createClass({
  propTypes: {
    $application: types.object.isRequired
  },

  render() {
    var {$application} = this.props;
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

        <div className="drugs-header">
          <div className="image-left">
            <Svg className="pill-bottles" src="pill-bottles-with-bg"/>
          </div>
          <div className="image-center">
            <Circle {...{$application}}/>
          </div>
          <div className="image-right">
            <Svg className="pill" src="pill-with-bg"/>
          </div>
        </div>

        {this.props.children}
      </div>
    );
  }
});

module.exports = DrugsLayout;