var gulp = require('gulp');
var gutil = require('gulp-util');
var hub = require('gulp-hub');
var runSequence = require('run-sequence');
var ghPages = require('gulp-gh-pages');


hub(['./src/static/gulpfile.js', './src/visualizer/gulpfile.js']);

gulp.task('clean', require('del').bind(null, ['dist/**/*']));

gulp.task('build', function(cb) {
    runSequence('clean',
              'prepare-static',
              'prepare-visualizer',
              cb);
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('build-deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['build']);