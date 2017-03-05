var gulp = require('gulp');
var concat = require('gulp-concat');
var refresh = require('gulp-livereload');
var webpack = require('webpack-stream');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var embedlr = require('gulp-embedlr');
//var del = require('del');

gulp.task('default', ['build']);

gulp.task('build', ['js', 'html', 'css', 'watch']);

gulp.task('js', function() {
    gulp.src(['src/js/*.js*'])
        .pipe(webpack(require('./webpack.config.js')))
        //.pipe(concat('bundle.js'))
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            //noSource: true
            mangleNames: false
            }))
        .pipe(gulp.dest('public/built/'))
        .pipe(refresh())
});
gulp.task('css', function() {
    gulp.src(['src/css/*.*css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/built/'))
        .pipe(refresh())
});
gulp.task('html', function() {
    gulp.src("src/*.html")
        .pipe(embedlr({
            port: 35729,
            src: "' +'http://' + (location.hostname || 'localhost') + ':" + 35729 + "/livereload.js?snipver=1"
        }))
        .pipe(gulp.dest('public/built/'))
        .pipe(refresh())
});

gulp.task('watch', function() {
    refresh.listen();
    gulp.watch('src/js/**', ['js']);
    gulp.watch('src/css/**', ['css']);
    gulp.watch('src/*.html', ['html']);
});