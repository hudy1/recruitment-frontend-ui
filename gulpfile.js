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
var plumber = require('gulp-plumber');
var wait = require('gulp-wait');
var imagemin = require('gulp-imagemin');

gulp.task('webpack', () => {
	gulp.src('./src/js/index.js')
	  .pipe(webpackStream(webpackConfig), webpack)
	  .pipe(gulp.dest('src/js'))
	  .pipe(gulp.dest('dist/js'));
  });

gulp.task('sass', function () {
	return gulp.src('./src/sass/all.scss')
		.pipe(wait(200))
		.pipe(plumber())
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


gulp.task('copy-assets', function() {
	var fonts = gulp.src('src/fonts/**').pipe(gulp.dest('dist/fonts'));
	var images = gulp.src('src/img/**').pipe(imagemin()).pipe(gulp.dest('dist/img')); // compress & copy

	return [fonts, images];
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
gulp.task('default', ['webpack', 'sass', 'minify-css', 'minify-html', 'copy-assets']);
