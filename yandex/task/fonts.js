const {src, dest} = require("gulp");

//Конфигурация
const path =require("../config/path.js");
const app =require("../config/app.js");

//Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const newer = require("gulp-newer");
// const webfont = require("gulp-webfont");
var ttf2woff2 = require('gulp-ttf2woff2');

// gulp.task('ttf2woff2', function(){
//   gulp.src(['fonts/*.ttf'])
//     .pipe(ttf2woff2())
//     .pipe(gulp.dest('fonts/'));
// });



const fonts = ()=> {
  return src(path.fonts.src)
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "FONTS",
        message: error.message
      }))
    }))
    .pipe(ttf2woff2())
    .pipe(newer(path.fonts.dest))
    .pipe(dest(path.fonts.dest))
};

module.exports = fonts;