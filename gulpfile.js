const gulp = require('gulp'),
    sass = require('gulp-sass'),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    pump = require('pump'),
    rename = require('gulp-rename');

const paths = {
    webroot: ""
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.scss = paths.webroot + "css/**/*.scss";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/scripts.min.js";
paths.concatCssDest = paths.webroot + "css/styles.min.css";

gulp.task("clean:js", done => rimraf(paths.concatJsDest, done));
gulp.task("clean:css", done => rimraf(paths.concatCssDest, done));
gulp.task("clean", gulp.series(["clean:js", "clean:css"]));


//min js #1
gulp.task("min:js", () => {
    return gulp.src([paths.js, "!" + paths.minJs], {
            base: "."
        })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});
//min js #2
gulp.task('compress:js', async (cb) => {
    pump([
        gulp.src('js/*.js'),
        uglify(),
        rename('sripts.min.js'),
        gulp.dest('js')
    ]);
});

//sass compile
gulp.task('sass', () => {
    return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest((f) => {
            return f.base;
        }))
});

//min css
gulp.task("min:css", () => {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

// A 'default' task is required by Gulp v4
gulp.task("default", gulp.series(["min:js", "sass", "min:css"]));

// watch
gulp.task('watch', gulp.series('sass', async () => {
    gulp.watch(['css/*.scss', 'js/scripts.js'], gulp.series('default'));
}));

// build
gulp.task('copy:js', async () => {
    return gulp.src('js/*.min.js')
        .pipe(gulp.dest('dist/js'));
});
gulp.task('copy:html', async () => {
    return gulp.src('*.html')
        .pipe(gulp.dest('dist'));
});
gulp.task('copy:css', async () => {
    return gulp.src(['css/*.min.css'])
        .pipe(gulp.dest('dist/css'));
});
gulp.task('copy:all', gulp.parallel(['copy:js', 'copy:html', 'copy:css']));