const COPYRIGHT = '/*(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.*/\n';

var debounce = require('lodash.debounce');
var del = require('del');
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var React = require('react');
var runSequence = require('run-sequence');
var through2 = require('through2');
var webpack = require('webpack-stream');

var restartServer = debounce(require('./server').restartServer, 1000);

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function rename(options = {}) {
  return through2.obj(function(file, encoding, callback) {
    var {base = process.cwd(), path: p = path.basename(file.path)} = options;
    callback(null, Object.assign(file, {base, path: p}));
  });
}

function javascriptStatic() {
  return gulp.src(require.resolve(`react/dist/react-with-addons${isProduction() ? '.min' : ''}`))
    .pipe(rename({path: `react-${React.version}.js`}));
}

function javascript(options = {}) {
  var webpackConfig = Object.assign({}, require('../config/webpack')(process.env.NODE_ENV), options);
  return gulp.src(['app/components/application.js'])
    .pipe(plugins.plumber())
    .pipe(webpack(webpackConfig))
    .pipe(plugins.tap(restartServer))
    .pipe(plugins.header(COPYRIGHT))
    .pipe(rename());
}

function sass() {
  return gulp.src('app/stylesheets/**/*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.init()))
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.write()))
    .pipe(plugins.if(isProduction(), plugins.minifyCss()))
    .pipe(plugins.header(COPYRIGHT));
}

function fonts() {
  return gulp.src(['vendor/pui-v1.4.0/fonts/*', 'node_modules/font-awesome/fonts/*'], {base: '.'})
    .pipe(plugins.rename({dirname: 'fonts'}));
}

function images() {
  return gulp.src('app/images/**', {base: '.'})
    .pipe(plugins.rename({dirname: 'images'}));
}

gulp.task('assets-stylesheets', function() {
  return sass().pipe(gulp.dest('public'));
});

gulp.task('watch-assets', function() {
  gulp.watch('app/stylesheets/**/*.scss', ['assets-stylesheets']);
});

gulp.task('clean-assets', callback => del(['public/*', '!public/.gitkeep'], callback));

gulp.task('assets-all', function() {
  var stream = mergeStream(
    javascriptStatic(),
    javascript({watch: !isProduction()}),
    sass(),
    fonts(),
    plugins.drFrankenstyle(),
    images()
  );

  if (process.env.NODE_ENV !== 'production') return stream.pipe(gulp.dest('public'));
  var cloneSink = plugins.clone.sink();
  return stream
    .pipe(gulp.dest('public'))
    .pipe(plugins.rev())
    .pipe(plugins.revCssUrl())
    .pipe(cloneSink)
    .pipe(gulp.dest('public'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('public'))
    .pipe(cloneSink.tap())
    .pipe(plugins.gzip())
    .pipe(gulp.dest('public'));
});

gulp.task('assets', function(callback) {
  runSequence('clean-assets', 'assets-all', callback);
});

module.exports = {
  sass
};