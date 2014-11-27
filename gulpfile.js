var gulp       = require("gulp"),
    jshint     = require("gulp-jshint"),
    concat     = require("gulp-concat"),
    gulpIf     = require("gulp-if"),
    ngAnnotate = require("gulp-ng-annotate"),
    uglify     = require("gulp-uglify"),
    jade       = require("gulp-jade"),
    sass       = require("gulp-ruby-sass"),
    minifyCSS  = require("gulp-minify-css"),
    connect    = require("gulp-connect"),
    watch      = require("gulp-watch"),
    notify     = require("gulp-notify"),
    env        = process.env.NODE_ENV || "development";

// Notify errors in JSHint
function notifyJS (file) {
  if (file.jshint.success) {
    return false;
  }

  var errors = file.jshint.results.map (function (data) {
    if (data.error) {
      return '(' + data.error.line + ':' + data.error.character + ')' + data.error.reason;
    }
  }).join ('\n');

  return file.relative + '(' + file.jshint.results.length + 'errors)\n' + errors;
}

// Looks for errors in gulpfile
gulp.task ('gulpfile', function () {
  return gulp.src ('gulpfile.js')
    .pipe (jshint ())
    .pipe (notify (notifyJS));
});


// Compiles Javascript scripts
gulp.task ('scripts', function () {
  return gulp.src ('./src/js/**/*.js')
    .pipe (jshint ())
    .pipe (notify (notifyJS))
    .pipe (concat ('application.js'))
    .pipe (gulpIf (env === 'production', ngAnnotate ({ dynamic: false })))
    .pipe (gulpIf (env === 'production', uglify ()))
    .pipe (gulp.dest ('./web/js/'))
    .pipe (connect.reload ());
});

// Compiles Jade templates
gulp.task ('html', function () {
  return gulp.src ('./src/views/**/*.jade')
    .pipe (jade ({
      pretty: true,
      data: {
        debut: false
      }
    }))
    .pipe (gulp.dest ('./web/'))
    .pipe (connect.reload ());
});

// Compiles Sass stylesheets
gulp.task ('styles', function () {
  return gulp.src ('./src/css/application.sass')
    .pipe (sass ())
    .pipe (gulpIf (env === 'production', minifyCSS ()))
    .pipe (gulp.dest ('./web/style/'))
    .pipe (connect.reload ());
});

// Move locale files
gulp.task ('locales', function () {
  return gulp.src ('./src/locales/**/*.json')
    .pipe (jshint ())
    .pipe (notify (notifyJS))
    .pipe (gulp.dest ('./web/locales/'))
    .pipe (connect.reload ());
});

// Serves the web sources at port 8000
gulp.task ('serve', function () {
  connect.server ({
    root: './web/',
    port: 8000,
    livereload: true
  });
});

// Builds the web sources
gulp.task ('build', ['scripts', 'locales', 'styles', 'html']);

// Runs everything
gulp.task ('default', ['serve', 'build'], function () {
  gulp.watch (['gulpfile.js'], ['gulpfile']);
  gulp.watch (['./src/js/**/*.js'], ['scripts']);
  gulp.watch (['./src/locales/**/*.json'], ['locales']);
  gulp.watch (['./src/css/**/*.sass'], ['styles']);
  gulp.watch (['./src/views/**/*.jade'], ['html']);
});
