var gulp      = require('gulp');
var connect   = require('gulp-connect');
var gp_concat = require('gulp-concat');

gulp.task('webserver', function() {
  connect.server({
    root: 'public',
    livereload: true,
    host: '127.0.0.1',
    port: 8080,
  });
});

gulp.task('reload', function() {
  var files = [
    './*.html'
  ];

  gulp.src(files)
    .pipe(connect.reload());
});

gulp.task('concat', function() {
  gulp.src(['./game/objects/**/*.js', './game/states/**/*.js', './game/index.js'])
    .pipe(gp_concat('game.js'))
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('watch', function () {
  gulp.watch([
    './index.html',
    './game/**/*.js',
  ], ['concat', 'reload']);
});

gulp.task('default', [
  'webserver',
  'concat',
  'watch'
]);