const {src, dest} = require("gulp");

//Конфигурация
const path =require("../config/path.js");
const app =require("../config/app.js");

//Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const fileInclude =require("gulp-file-include");
const htmlmin =require("gulp-htmlmin");
const size =require("gulp-size");
const webpHtml =require("gulp-webp-html");
const gulpif = require("gulp-if");


const html = ()=> {
  return src(path.html.src)
  .pipe(plumber({
    errorHandler: notify.onError(error =>({
      title: "HTML",
      message: error.message
    }))
  }))
  .pipe(fileInclude())
  .pipe(gulpif(app.isProd, webpHtml()))
  .pipe(gulpif(app.isProd, size({title: "До сжатия"})))
  .pipe(gulpif(app.isProd, htmlmin(app.htmlmin)))
  .pipe(gulpif(app.isProd, size({title: "после сжатия"})))
  .pipe(dest(path.html.dest));
};

module.exports = html;