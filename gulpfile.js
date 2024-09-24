const gulp = require('gulp');

// Task to copy .hbs files
gulp.task('copy-email-templates', function () {
  return gulp
    .src('src/third_party/mail/templates/**/*.hbs')
    .pipe(gulp.dest('build/third_party/mail/templates'));
});

// Task to copy .ejs files
gulp.task('copy-pdf-templates', function () {
  return gulp
    .src('src/third_party/pdf/templates/**/*.ejs')
    .pipe(gulp.dest('build/third_party/pdf/templates'));
});

// Default task to build the project
gulp.task(
  'default',
  gulp.parallel('copy-email-templates', 'copy-pdf-templates'),
);
