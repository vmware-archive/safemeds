var gulp = require('gulp');
var es = require('event-stream');
var reduce = require('stream-reduce');
var fs = require('fs');

gulp.task('drug-names', function() {
  fs.createReadStream('drug-names.txt', {flags: 'r'})
    .pipe(es.split())
    .pipe(es.through(function(data) {
      if (data.length >= 2) {
        this.emit('data', data.toLowerCase());
      }
    }))
    .pipe(reduce((memo, data) => (memo.push(data), memo), []))
    .pipe(es.stringify())
    .pipe(fs.createWriteStream('config/drug_names.json'));
});