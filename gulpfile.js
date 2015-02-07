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
    config    = {
      env      : process.env.NODE_ENV || "development",
      sassPath : './src/css',
      bowerDir : './bower_components'
    };

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
    .pipe (gulpIf (config.env === 'production', ngAnnotate ({ dynamic: false })))
    .pipe (gulpIf (config.env === 'production', uglify ()))
    .pipe (gulp.dest ('./public/js'))
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
    .pipe (gulp.dest ('./public'))
    .pipe (connect.reload ());
});

// Compiles Sass stylesheets
gulp.task ('styles', function () {
  return gulp.src ('./src/css/application.sass')
    .pipe (sass ({
      loadPath: [
        config.sassPath,
        config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        config.bowerDir + '/fontawesome/scss'
      ]}).on ('error', notify.onError (function (error) {
        return 'Error: ' + error.message;
    })))
    .pipe (gulpIf (config.env === 'production', minifyCSS ()))
    .pipe (gulp.dest ('./public/style'))
    .pipe (connect.reload ());
});

// Move locale files to public directory
gulp.task ('locales', function () {
  return gulp.src ('./src/locales/**/*.json')
    .pipe (jshint ())
    .pipe (notify (notifyJS))
    .pipe (gulp.dest ('./public/locales'))
    .pipe (connect.reload ());
});

// Moves FontAwesome icons to public directory
gulp.task ('icons', function () {
  return gulp.src (config.bowerDir + '/fontawesome/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'));
});

// Copies images to public directory
gulp.task ('images', function () {
  return gulp.src ('./src/img/**.*')
    .pipe(gulp.dest('./public/images'));
});

// Serves the public directory at port 8000
gulp.task ('serve', function () {
  connect.server ({
    root: './public/',
    port: 8000,
    livereload: true
  });
});

// Builds the public directory
gulp.task ('build', ['images', 'icons', 'scripts', 'locales', 'styles', 'html']);

// Runs everything
gulp.task ('default', ['serve', 'build'], function () {
  gulp.watch (['gulpfile.js'], ['gulpfile']);
  gulp.watch (['./src/js/**/*.js'], ['scripts']);
  gulp.watch (['./src/locales/**/*.json'], ['locales']);
  gulp.watch (['./src/css/**/*.sass'], ['styles']);
  gulp.watch (['./src/views/**/*.jade'], ['html']);
  gulp.watch (['./src/img/**.*'], ['images']);
});
