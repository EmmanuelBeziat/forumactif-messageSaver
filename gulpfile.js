/**
 * Dépendances gulp
 */
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify');

/**
 * Sauvegarde et compresse les fichiers JS dans un fichier minifié
 * Crée un fichier sourcemap
 **/
gulp.task('javascript', function() {
	return gulp.src('fa-messageSaver.js')
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename('fa-messageSaver.min.js'))
		.pipe(gulp.dest(''));
});

gulp.task('default', ['javascript'], function() {
});

gulp.task('watch', function() {
	gulp.watch('fa-messageSaver.js', ['javascript']);
});