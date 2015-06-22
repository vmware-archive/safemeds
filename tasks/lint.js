var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'app/**/*.js', '!app/vendor/**/*.js', 'helpers/**/*.js', 'server/**/*.js', 'spec/**/*.js', '!spec/app/public/lib/**/*.js', 'tasks/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format('stylish'))
    .pipe(plugins.eslint.failOnError());
});