var gulp = require('gulp');
var gutil = require('gulp-util');
var {spawn} = require('child_process');

var node;
function restartServer() {
  if (node) return node.kill('SIGUSR2');
}
process.on('exit', restartServer);

gulp.task('server', function() {
  if (node) return node.kill('SIGUSR2');
  node = spawn('node', ['index.js'], {stdio: 'inherit', env: process.env});
  node.on('close', function(code) {
    if (code === 8) {
      node = null;
      gutil.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch-server', function() {
  gulp.watch(['server/**/*.js', 'helpers/**/*.js', 'lib/**/*.js'], ['server']);
});

gulp.task('s', ['server', 'watch-server', 'watch-assets', 'assets']);

module.exports = {restartServer};