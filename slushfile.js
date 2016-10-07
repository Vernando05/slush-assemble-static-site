var gulp = require('gulp'),
	install = require('gulp-install'),
	conflict = require('gulp-conflict'),
	template = require('gulp-template'),
    rename = require('gulp-rename'),
	exec = require('child_process').exec,
	del =  require('del'),
	inquirer = require('inquirer');

var projectConfig = {
	projectName: 'new-site'
}
gulp.task('pkginstall', ['compass'], function (cb) {
	gulp.src(['./' + projectConfig.projectName + '/bower.json', './' + projectConfig.projectName + '/package.json'])
		.pipe(install())
		.on('end', function () {
			cb();
		});
});
gulp.task('compass', ['setup'], function (cb) {
   exec('compass create ' + projectConfig.projectName + ' -r bootstrap-sass --using bootstrap', function (err, stdout, stderr) {
		if (err) console.log(err);
		console.log(stdout);
		gulp.src('src/sass/_bootstrap-variables.scss', { cwd: projectConfig.projectName, dot: true })
			.pipe(gulp.dest('src/sass/bootstrap'))
			.on('end', function () {
				del(['.sass-cache', 'src/config.rb', 'src/sass/styles.scss', 'src/sass/_bootstrap-variables.scss'], { force: true });
			});	
		cb();	
	});
});
gulp.task('setup', function (cb) {
	inquirer.prompt([
		{type: 'input', name: 'name', message: 'Project name: ', default: projectConfig.projectName },
		{type: 'confirm', name: 'moveon', message: 'Continue?'}
	]).then( function (answers) {
		if (!answers.moveon) {
			cb();
		}
		projectConfig.projectName = answers.name;
		gulp.src('new-site/**', { dot: true })
			.pipe(gulp.dest(answers.name))
			.on('end', function () {
				del('new-site');
			});
		cb();
	});
});
gulp.task('default', ['pkginstall']);