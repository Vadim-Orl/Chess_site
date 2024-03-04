const {src, dest} = require("gulp");

//Конфигурация
const path =require("../config/path.js");
const app =require("../config/app.js");

//Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const shorthand = require("gulp-shorthand");
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const sass = require("gulp-sass")(require("sass"));
const webpСss = require("gulp-webp-css");
const gulpif = require("gulp-if");



const scss = ()=> {
  console.log("111");
  return src(path.scss.src, {sourcemaps: app.isDev})
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "SCSS",
        message: error.message
      }))
    }))
    .pipe(sass())
    .pipe(gulpif(app.isProd,webpСss()))
    .pipe(autoprefixer())
    .pipe(groupCssMediaQueries())
    .pipe(gulpif(app.isProd,shorthand()))
    .pipe(gulpif(app.isProd,csso()))
    .pipe(dest(path.scss.dest, {sourcemaps: app.isDev}))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulpif(app.isProd,shorthand()))
    .pipe(gulpif(app.isProd,csso()))
    .pipe(gulpif(app.isProd,dest(path.scss.dest, {sourcemaps: app.isDev})));

};

module.exports = scss;