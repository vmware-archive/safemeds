var React = require('react/addons');
var Svg = require('./svg');

var types = React.PropTypes;

var DrugsLayout = React.createClass({
  propTypes: {
    left: types.object,
    right: types.object,
    center: types.object
  },

  render() {
    var {left, center, right} = this.props;
    return (
      <div>
        <header>
          <Svg className="logo" src="logo"/>
        </header>
        <h1 className="tagline">
          <span className="before">Know the effects</span>
          <span className="separator">></span>
          <span className="after">before you ingest.</span>
        </h1>

        <div className="compare-body">
          <div className="compare-left">
            <div className="image-wrapper">
              <Svg className="pill-bottle" src="pill-bottle"/>
            </div>
            {left}
          </div>

          <div className="compare-center">
            <div className="image-wrapper">
              <div className="circle">
                <span>and</span>
              </div>
            </div>
            {center}
          </div>

          <div className="compare-right">
            <div className="image-wrapper">
              <Svg src="pill" className="pill"/>
            </div>
            {right}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = DrugsLayout;