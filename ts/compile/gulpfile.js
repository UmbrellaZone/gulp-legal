// import gulp
var gulp = require("gulp");
var gulpTypescript = require("gulp-typescript");
var pr = require("pushrocks");

gulp.task('compileTS', function() {
	var stream = gulp.src('../index.ts')
	  .pipe(gulpTypescript({
	  	out: "index.js"
	  }))
	  .pipe(gulp.dest("../../"));
	return stream;
});

gulp.task('default',['compileTS'], function() {
	pr.beautylog.success('Typescript compiled');
});