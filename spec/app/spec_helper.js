global.oldSetImmediate = global.setImmediate;
global.setImmediate = require('./support/mock_set_immediate');
require('babel/polyfill');
require('jasmine_dom_matchers');
require('jasmine-ajax');
require('../spec_helper');

var factories = require.context('../factories', true, /\.js$/);
factories.keys().forEach(factories);

var Cursor = require('pui-cursor');
var Deferred = require('./support/deferred');
var jQuery = require('jquery');
var MockPromises = require('mock-promises');
var React = require('react');
var {Promise} = require('es6-promise');
var {withContext} = require('./support/react_helper');

global.oldPromise = global.Promise;
global.MockPromise = Promise;

Object.assign(global, {
  Cursor,
  Deferred,
  jQuery,
  MockPromises,
  Promise,
  React,
  withContext,
  $: jQuery
});

beforeEach(function() {
  global.safemeds = {animation: false, matchMedia: jasmine.createSpy('matchMedia').and.returnValue({matches: false})};

  $('body').find('#root').remove().end().append('<div id="root"/>');

  var Cursor = require('pui-cursor');
  Cursor.async = false;

  var Layout = require('../../server/components/layout');
  spyOn(Layout, 'init');
  jasmine.clock().install();
  jasmine.Ajax.install();
  Object.assign(XMLHttpRequest.prototype, {
    succeed(data = {}, options = {}) {
      this.respondWith(Object.assign({status: 200, responseText: JSON.stringify(data)}, options));
    },
    fail(data, options = {}) {
      this.respondWith(Object.assign({status: 400, responseText: JSON.stringify(data)}, options));
    }
  });

  MockPromises.install(Promise);

  jasmine.addMatchers({
    toHaveBeenRequested() {
      return {
        compare(actual) {
          var pass = jasmine.Ajax.requests.filter(new RegExp(actual)).length > 0;
          return {pass};
        }
      };
    },

    toHaveBeenRequestedWith() {
      return {
        compare(actual, options) {
          var requests = jasmine.Ajax.requests.filter(new RegExp(actual));
          var pass = requests.some(request => {
            return Object.keys(options).every(k => {
              var observed = typeof request[k] === 'function' ? request[k]() : request[k];
              return jasmine.matchersUtil.equals(observed, options[k]);
            });
          });
          var message = pass ?
            `Expected ${actual} not to have been requested with ${JSON.stringify(options)}` :
            `Expected ${actual} to have been requested with ${JSON.stringify(options)},
              actual requests were ${jasmine.Ajax.requests.filter(/.*/).map(function(req) {
              return `${JSON.stringify({
                method: req.method,
                url: req.url,
                data: req.data && req.data(),
                headers: req.requestHeaders
              })}`;
            }).join('\n')}`;
          return {pass, message};
        }
      };
    }
  });
});

afterEach(function() {
  jasmine.clock().tick(1);
  jasmine.clock().uninstall();
  jasmine.Ajax.uninstall();
  MockPromises.contracts.reset();
});