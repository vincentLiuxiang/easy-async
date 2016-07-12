var gulp = require('gulp');
var babel = require('gulp-babel');
var minify = require('gulp-minify');

gulp.task('default', function() {
  gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(minify())
    .pipe(gulp.dest('./lib'));
});