const {src, dest} = require("gulp");

//Конфигурация
const path =require("../config/path.js");
const app =require("../config/app.js");

//Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const concat = require("gulp-concat");
const cssimport = require("gulp-cssimport");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const shorthand = require("gulp-shorthand");
const webpСss = require("gulp-webp-css");
const groupCssMediaQueries = require("gulp-group-css-media-queries");




const css = ()=> {
  return src(path.css.src, {sourcemaps: app.isDev})
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "SCC",
        message: error.message
      }))
    }))
    .pipe(concat("style.css"))
    .pipe(cssimport())
    .pipe(webpСss())
    .pipe(autoprefixer())
    .pipe(groupCssMediaQueries())
    .pipe(dest(path.css.dest, {sourcemaps: app.isDev}))
    .pipe(rename({suffix: ".min"}))
    .pipe(shorthand())
    .pipe(csso())
    .pipe(dest(path.css.dest, {sourcemaps: app.isDev}));
};

module.exports = css;