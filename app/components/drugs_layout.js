var Circle = require('./circle');
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
          <span className="separator"><i className="fa fa-angle-right"></i></span>
          <span className="after">before you ingest.</span>
        </h1>

        <div className="compare-header">
          <div className="image-left">
            <Svg className="pill-bottle" src="pill-bottle"/>
          </div>
          <div className="image-center">
            <div className="circle">
              <span>and</span>
            </div>
          </div>
          <div className="image-right">
            <Svg src="pill" className="pill"/>
          </div>
        </div>

        {this.props.children}
      </div>
    );
  }
});

module.exports = DrugsLayout;