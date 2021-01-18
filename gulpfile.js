var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify = require("gulp-notify");

//Notify css error
function errorAlertPost(error) {
    notify.onError({
        title: "SCSS",
        subtitle: "Algo esta mal en tu CSS!",
        sound: "Basso"
    })(error);
    console.log(error.toString());
    this.emit("end");
}

gulp.task("sass", () =>
  gulp.src("./assets/scss/**/*.scss")
      .on("error", errorAlertPost)
      .pipe(sass({
          outputStyle: 'compressed'
      }))
      .pipe(gulp.dest("./assets/css/"))
);


function watchFiles() {
    return gulp.watch(['./assets/scss/**/*.scss'], gulp.series('sass'));
};

gulp.task('watch-files', gulp.series(watchFiles));