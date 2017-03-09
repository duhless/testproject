'use strict';

var join = require('path').join;
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var newer = require('gulp-newer');
var bower = require('gulp-bower');
var browserSync = require('browser-sync');
var rimraf = require('gulp-rimraf');

gulp.task('default', function() {
	console.log('hello');
});

gulp.task('styles:dev', function() {
	return gulp.src('protected/public/frontend/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 version'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('protected/public/assets/css'));
});

gulp.task('styles:prod', function() {
	return gulp.src('protected/public/frontend/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(gulp.dest('protected/public/assets/css'));
});

gulp.task('scripts', function() {

});

gulp.task('clean', function() {
	return gulp.src('protected/public/assets/{css,js}', {read: false})
		.pipe(rimraf());
});

gulp.task('build', ['sass:prod']);

gulp.task('debug', function() {
	var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});