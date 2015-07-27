var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var harp        = require('harp');
var Q = require('q');
var clean = require('gulp-clean');

/**
 * Serve the Harp Site from the src directory
 */
gulp.task('serve', function () {
  harp.server('.', {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch("public/**/*.sass", function () {
      reload("main.css", {stream: true});
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["public/**/*.ejs"], function () {
      reload();
    });
  });
});

// gulp.task('clean', require('del').bind(null, ['.tmp', 'dist/**/*']));

gulp.task('clean', function(){
  return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build-harp', ['clean'], function(){
  var deferred = Q.defer();
  harp.compile(__dirname, 'dist', function(){
    deferred.resolve();
  });
  return deferred.promise;  
});

gulp.task('copy-static', ['build-harp'], function(){

  return gulp.src('public/**/!(*.ejs|*.jade|*.coffee|*.scss|*.less|*.md)')
  .pipe(gulp.dest("dist"));

});


gulp.task('build', ['copy-static'], function(){

});

gulp.task('prepare-static', ['build'], function(){
    gulp.src('dist/**/*')
    .pipe(gulp.dest('../../public'));
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);