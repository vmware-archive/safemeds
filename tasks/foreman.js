var gulp = require('gulp');
var {spawn} = require('child_process');

gulp.task('foreman', function(callback) {
  var child = spawn('nf', ['start', '-j', 'Procfile.dev'], {stdio: 'inherit', env: process.env})
    .on('close', callback);
  ['SIGINT', 'SIGTERM'].forEach(e => process.once(e, () => child && child.kill()));
});