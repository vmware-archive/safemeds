var React = require('react/addons');
var Svg = require('./svg');

var CreativeCommons = React.createClass({
  render() {
    return (
      <p className="fine-print">
        <br/>
        <br/>
        <a rel="license"
           href="http://creativecommons.org/publicdomain/zero/1.0/">
          <img src="http://i.creativecommons.org/p/zero/1.0/88x31.png" style={{borderStyle: 'none'}} alt="CC0" />
        </a>
        <br/>
        <br/>
        To the extent possible under law, <a rel="dct:publisher" href="//pivotal.io" target="_blank"><span property="dct:title">Pivotal Software, Inc</span></a> has waived all copyright and related or neighboring rights to <span property="dct:title">safemeds</span>.
        <br/>
        This work is published from: <span property="vcard:Country" datatype="dct:ISO3166" content="US" about="pivotal.io">United States</span>.
      </p>
    );
  }
});

var Footer = React.createClass({
  render() {
    return (
      <footer>
        <div className="svg"><Svg src="pill-bottle-disclaimer"/></div>
        <span className="arrow"/>
        <span className="disclaimer">Disclaimer</span>
        <p>Always consult your doctor before starting a new medication.</p>
        <span className="fine-print">This site is for informational purposes only.</span>
        <CreativeCommons/>
      </footer>
    );
  }

});

module.exports = Footer;