var Application = require('../app/components/application');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var express = require('express');
var gzipStatic = require('connect-gzip-static');
var component = require('./middleware/component');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(gzipStatic(`${__dirname}/../public`, {maxAge: process.env.NODE_ENV === 'production' && 604800000}));
app.use(compression());

app.get('/', ...component.show(Application, 'application'));

module.exports = app;