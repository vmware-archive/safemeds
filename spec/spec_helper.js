require('babel/register');

var React = require('react/addons');
var {Factory} = require('rosie');

Object.assign(global, {
  Factory, React
});

beforeEach(function() {
  jasmine.addMatchers({
    toBeEmpty() {
      return {
        compare(actual) {
          var pass = actual instanceof Array ? !actual.length : !Object.keys(actual).length;
          return {pass};
        }
      };
    }
  });
});