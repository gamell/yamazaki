var gulp = require('gulp');
var gutil = require('gulp-util');
var hub = require('gulp-hub');
var runSequence = require('run-sequence');
var ghpages = require('gh-pages');
var path = require('path');

hub(['./src/static/gulpfile.js', './src/visualizer/gulpfile.js']);

var deploy = function(cb){
  ghpages.publish(path.join(__dirname,'dist'), {src:'**/*'}, function(err) { cb(); });  
};

gulp.task('clean', require('del').bind(null, ['dist/**/*']));

gulp.task('prepare-root', function(){
    return gulp.src('./src/!(visualizer|static)')
    .pipe(gulp.dest('dist'));    
});

gulp.task('build', function(cb) {
    runSequence('clean',
              ['prepare-root', 'prepare-static'],
              'prepare-visualizer',
              cb);
});

gulp.task('deploy', function(cb) {
  deploy(cb);
});

gulp.task('build-deploy', ['build'], function(cb) {
  deploy(cb);
});

gulp.task('default', ['build']);