/**
 * Dépendances gulp
 */
const { src, dest, watch, series } = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

/**
 * Sauvegarde et compresse les fichiers JS dans un fichier minifié
 * Crée un fichier sourcemap
 **/
/* gulp.task('javascript', function () {
	return gulp.src('fa-messageSaver.js')
		.pipe(uglify())
		.pipe(rename({ extname: 'min.js' }))
		.pipe(gulp.dest(''));
});

gulp.task('default', ['javascript'], function () {
})

gulp.task('watch', function () {
	gulp.watch('fa-messageSaver.js', ['javascript'])
})
 */

function script () {
	return src('fa-messageSaver.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify({
			output: { comments: '/^!/' }
		}))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(dest('./'))
}

function lookup () {
	watch('fa-messageSaver.js', { delay: 500 }, series(script))
}

exports.script = script
exports.lookup = lookup
