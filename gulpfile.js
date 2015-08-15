// import from npm
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache');
	concat = require('gulp-concat'),
	rename = require('gulp-rename');

	var src = 'src/';
	var dest = 'build/';

// Minify and Concat JS files

gulp.task('scripts', function() {
  return gulp.src('./src/*.js')
    .pipe(concat('all.js'))
    
    .pipe(gulp.dest('./build/'));
});


// Compress Images
gulp.task('image', function(){
	gulp.src(['assets/*.png', 'assets/*.jpg'])
		.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
		.pipe(gulp.dest('build/img'));	
	});



// allows you to just type 'gulp' in terminal
gulp.task('default', ['scripts', 'image']); 

