let gulp = require("gulp");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
// let bootstrap = require('bootstrap');
let browserSync = require("browser-sync").create();
let browserify = require("browserify");
let uglify = require("gulp-uglify-es").default;
let concat = require('gulp-concat');
let cleanCss = require("gulp-clean-css");
let sourse = require("vinyl-source-stream");

let config = {
  server: {
    baseDir: "build",
  },
  path: {
    dest: {
      svg: "./build/img/vector/sprite",
      styles: "./build/css",
      scripts: "./build/js",
      images: "./build/img",
      fonts: "./build/fonts",
      html: "./build",
    },
    src: {
      styles: "./src/scss/index.scss",
      scripts: "./src/js/**/*.js",
      images: ["!./src/img/vector/sprite/*", "./src/img/**/*.*"],
      fonts: "./src/fonts/*.*",
      html: "./src/*.html",
    },
    watch: {
      styles: "./src/scss/**/*.scss",
      scripts: "./src/js/**/*.js",
      images: "./src/img/**/*.*",
      fonts: "",
      vue: "./src/vue/**/*.vue",
      html: "./src/*.html",
    },
  },
};

function makeStyles() {
  return gulp
    .src(config.path.src.styles)
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest(config.path.dest.styles))
    .pipe(browserSync.stream());
}

async function makeScripts() {
  return gulp
  .src(config.path.src.scripts)
  .pipe(uglify())
  .pipe(concat('index.js'))
  .pipe(gulp.dest(config.path.dest.scripts))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function copyImages() {
  return gulp
    .src(config.path.src.images)
    .pipe(gulp.dest(config.path.dest.images));
}

function makeFonts() {
  return gulp
    .src(config.path.src.fonts)
    .pipe(gulp.dest(config.path.dest.fonts));
}

function copyHTML() {
  return gulp
    .src(config.path.src.html)
    .pipe(gulp.dest(config.path.dest.html))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function watch() {
  browserSync.init({
    server: config.server,
    notify: false,
  });

  gulp.watch(config.path.watch.styles, makeStyles);
  gulp.watch(config.path.watch.scripts, makeScripts);
  gulp.watch(config.path.watch.images, copyImages);
  gulp.watch(config.path.watch.html, copyHTML);
}

gulp.task("copyimg", copyImages);
gulp.task("styles", makeStyles);
gulp.task("scripts", makeScripts);
gulp.task("img", copyImages);
gulp.task("fonts", makeFonts);
gulp.task("html", copyHTML);
gulp.task("watch", watch);

gulp.task("build", gulp.series("html", "styles", "fonts", "img", "scripts"));

gulp.task("start", gulp.series("build", "watch"));
