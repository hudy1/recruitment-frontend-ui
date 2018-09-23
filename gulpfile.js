var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');

gulp.task('webpack', () => {
	gulp.src('./src/js/index.js')
	  .pipe(webpackStream(webpackConfig), webpack)
	  .pipe(gulp.dest('src/js'))
	  .pipe(gulp.dest('dist/js'));
  });

gulp.task('sass', function () {
	return gulp.src('./src/sass/all.scss')
		.pipe(concat('style.css'))
		.pipe(sass.sync())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('src/css'));
});

gulp.task('minify-html', () => {
	return gulp.src('src/*.html')
	  .pipe(htmlmin({ collapseWhitespace: true }))
	  .pipe(gulp.dest('dist'));
  });

gulp.task('minify-css', ['sass'], function () {
	return gulp.src('src/css/style.css')
		.pipe(cleanCSS())
		.pipe(rename({
			basename: 'style',
			extname: '.css'
		}))
		.pipe(gulp.dest('dist/css/'));
});

function browserReload(done) {
	browserSync.reload();
	done();
}

gulp.task('cssReload', ['minify-css'], browserReload);
gulp.task('jsReload', ['webpack'],  browserReload);
gulp.task('watch', ['webpack', 'sass'], function () {
	browserSync.init({
		server: {
			baseDir: "./src/"
		}
	});
	gulp.watch('src/sass/**/*.scss', ['cssReload']); 
	gulp.watch('src/js/*.js', ['jsReload'])
	gulp.watch('src/*.html').on('change', browserSync.reload);
});
gulp.task('default', ['webpack', 'sass', 'minify-css', 'minify-html']);
