// gulp
var gulp = require('gulp');

// plugins
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var concat = require('gulp-concat');

// browsersync for live reload
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

/*
 * need this to fix angular minification problem,
 * see http://blog.jhades.org/what-every-angular-project-likely-needs-and-a-gulp-build-to-provide-it/
 */ 
var  ngAnnotate = require('browserify-ngannotate');

// =======================================================================
// File Paths
// =======================================================================
var filePath = {
    js: {
        src: ['./app/**/*.js', '!./app/libs/**']
    },
    html: {
      src : ['./app/**/*.html']
    }
  };

// tasks
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
    gulp.src('./app/bundled.js')
      .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/libs/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/libs/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('copy-bower-components', function () {
  gulp.src('./app/libs/**')
    .pipe(gulp.dest('dist/libs'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('connect', ['browserify'], function () {

/*
  Note: need to add reloadDelay to prevent browser trying to reload when node is not ready and end up hanging browse
  see https://github.com/BrowserSync/browser-sync/issues/392
*/
    browserSync.init({
        open:  true ,
        reloadDelay : 2000,
        server: {
            baseDir: 'app/'
        }
    });

    gulp.watch([
      'app/**/*' , '!app/libs/**', '!app/bundled.js'
    ] , ['serve:reload'] );
    
});

gulp.task('browserify', function() {
  browserify('app/app.js', {
        debug: true,
        transform: [ngAnnotate]
      })
      .bundle()
      .pipe(source('bundled.js'))
      .pipe(gulp.dest('./app'));
});

gulp.task('browserifyDist', function() {
    browserify('app/app.js', {
        debug: true,
        transform: [ngAnnotate]
      })
      .bundle()
      .pipe(source('bundled.js'))
      .pipe(gulp.dest('./dist'));
});

// =======================================================================
// Watch for changes
// =======================================================================
gulp.task('serve:reload' , ['browserify'], function(done){
  reload();
  done();
});

// default task
gulp.task('default',
  ['browserify', 'connect']
);

gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['minify-css', 'browserifyDist', 'minify-js', 'copy-html-files', 'copy-bower-components']
  );
});