var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'del', 'assemble', 'merge-stream', 'run-sequence', 'ip']}),
	exec = require('child_process').exec;

var flags = {
		dist: false
	},
	libjs = [
		'src/components/jquery-validation/dist/jquery.validate.min.js',
		'src/components/bootstrap-grid-columns-clearing/js/ie-row-fix.js',
		'src/components/placeholders/dist/placeholders.min.js',
		'src/javascripts/bootstrap.js'
	],
	libcss = [
			'src/components/bootstrap-grid-columns-clearing/css/multi-columns-row.css',
	],
	libimg = [
	],
	devport = '9001',
	distport = '9002';

gulp.task('clean', function () {
	return flags.dist ? plugins.del(['dist/*']) : plugins.del(['src/*.html']);
});

gulp.task('style-bootstrap', function () {
	let dest = flags.dist ? 'dist/css' : 'src/stylesheets';
	plugins.del.sync('src/stylesheets/bootstrap.min.css');
	return gulp.src('src/sass/bootstrap/*.scss')
		.pipe(plugins.compass({
			config_file: 'config.rb',
			sass: 'src/sass/bootstrap',
			css: 'src/stylesheets'
		}))
		.pipe(plugins.autoprefixer('last 14 version', 'ie', 'iOS', 'Safari', 'Firefox', 'Opera', 'bb', 'Android', 'Chrome', 'ChromeAndroid'))
		.pipe(plugins.rename('bootstrap.min.css'))
		.pipe(gulp.dest(dest))
		.on('end', function() {
			plugins.del('src/stylesheets/bootstrap-main.css');
		});
});

gulp.task('style-main', function () {
	let dest = flags.dist ? 'dist/css' : 'src/stylesheets';
	plugins.del.sync('src/stylesheets/styles.css');
	return gulp.src('src/sass/main/*.scss')
		.pipe(plugins.compass({
			http_path: '/',
			style: 'compressed',
			sass: 'src/sass/main',
			css: 'src/stylesheets',
			javascript: 'src/javascripts',
			font: 'src/fonts',
			image: 'src/images'
		}))
		.pipe(plugins.autoprefixer('last 14 version', 'ie', 'iOS', 'Safari', 'Firefox', 'Opera', 'bb', 'Android', 'Chrome', 'ChromeAndroid'))
		.pipe(gulp.dest(dest));
});

gulp.task('script-main', function () {
	let dest = flags.dist ? 'dist/js' : 'src/javascripts';
	return gulp.src('src/javascripts/main.js')
		.pipe(plugins.jshint({
			lookup: false
		}))
		.pipe(plugins.jshint.reporter('default'))
		.pipe(gulp.dest(dest));
});

gulp.task('modernizr', function (cb) {
	exec( 'modernizr -c modernizr-config.json -d src/javascripts', function (err, stdout, stderr) {
		console.log(stdout);
		cb(err);
	});
});

gulp.task('template', function () {
	let dest = flags.dist ? 'dist' : 'src';
	let assemble = plugins.assemble();
	assemble.layout('src/layouts/default.hbs');
	assemble.option('layout', 'default');
	assemble.pages('src/*.hbs', {layout: 'default'});
    return assemble.toStream('pages')
        .pipe(assemble.renderFile())
		.pipe(plugins.extname())
        .pipe(assemble.dest(dest));
});

gulp.task('change-libpath', function (){
	return gulp.src('dist/*.html')
		.pipe(plugins.processhtml())
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-libnasset', function () {
	let images = gulp.src('src/images/**')
				.pipe(gulp.dest('dist/images'));

	let fonts = gulp.src('src/fonts/**')
				.pipe(gulp.dest('dist/fonts'));

	let jslib = gulp.src(libjs)
				.pipe(plugins.order(libjs, {base: '.'}))
				.pipe(plugins.concat('lib.min.js'))
				.pipe(plugins.uglify())
				.pipe(gulp.dest('dist/js'));

	let csslib = gulp.src(libcss)
				.pipe(plugins.concat('lib.min.css'))
				.pipe(plugins.cleanCss())
				.pipe(gulp.dest('dist/css'));
	let imglib = gulp.src(libimg)
				.pipe(gulp.dest('dist/css'));

	return plugins.mergeStream(images, fonts, csslib, jslib);
});

gulp.task('servedev', function () {
	plugins.connect.server({
		port: devport,
		host: plugins.ip.address(),
		root: 'src',
		livereload: true
	});
});

gulp.task('servedist', function () {
	plugins.connect.server({
		port: distport,
		host: plugins.ip.address(),
		root: 'dist',
		livereload: true
	});
});

gulp.task('reload', function () {
	gulp.src(['src/*.html', 'dist/*.html'])
		.pipe(plugins.connect.reload());
});

gulp.task('openbrowser', function () {
	gulp.src('src/index.html')
		.pipe(plugins.open({
			uri: plugins.ip.address() + ':' + (flags.dist ? distport : devport),
			app: 'firefox'
		}));
});

// To do
// gulp.task('deploy', function () {
// 	exec('git config --global user.email "" && git config --global user.name ""', function (err, stdout, stderr) {
// 		if (err) console.log(err);
// 		console.log(stdout);
// 	});
// 	return gulp.src('dist')
// 		.pipe(plugins.ghPages({
// 			remoteUrl: "",
// 			branch: "master"
// 		}));
// });

gulp.task('watch', function () {
	gulp.watch(['src/*.hbs', 'src/layouts/*.hbs'], ['template'], 'reload');
	gulp.watch('src/sass/bootstrap/*.scss', ['style-bootstrap'], 'reload');
	gulp.watch('src/sass/main/*.scss', ['style-main'], 'reload');
	gulp.watch('src/javascripts/main.js', ['script-main'], 'reload');
	gulp.watch('src/javascripts/modernizr.js', ['script-libhead'], 'reload');
	gulp.watch('modernizr-config.json', ['modernizr']);
});

gulp.task('default', function () {
	plugins.runSequence('clean', 'style-bootstrap', ['template', 'style-main', 'script-main', 'watch'], 'servedev', 'openbrowser');
});

gulp.task('dist', function () {
	flags.dist = true;
	plugins.runSequence('clean', 'style-bootstrap', 'template', ['change-libpath', 'style-main', 'script-main', 'copy-libnasset'], 'servedist', 'openbrowser');
});