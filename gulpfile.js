const gulp = require('gulp');

// Task to copy .hbs files
gulp.task('copy-templates', function () {
  return gulp
    .src('src/third_party/mail/templates/**/*.hbs')
    .pipe(gulp.dest('build/third_party/mail/templates'));
});

// Default task to build the project
gulp.task('default', gulp.series('copy-templates'));
