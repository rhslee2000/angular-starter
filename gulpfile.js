// gulp
var gulp = require('gulp');

// plugins
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

// browsersync for live reload
var browserSync = require('browser-sync').create();

var ngAnnotate = require('gulp-ng-annotate');

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

gulp.task('connect', function () {

    browserSync.init({
        open:  true ,
        server: {
            baseDir: 'app/'
        }
    });

    gulp.watch([
      'app/**/*' , '!app/libs/**'
    ] , ['serve:reload'] );
});

gulp.task('browserify', function() {
  gulp.src(['app/app.js'])
  .pipe(ngAnnotate())
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./app'))
});

gulp.task('browserifyDist', function() {
  gulp.src(['app/app.js'])
  .pipe(ngAnnotate())
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./dist'))
});

// =======================================================================
// Watch for changes
// =======================================================================
gulp.task('serve:reload' , []  , function(){
  browserSync.reload();
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