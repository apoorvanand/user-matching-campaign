module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concurrent: {
			target: {
				tasks: [
					'nodemon',
					'watch'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					ignore: [
						'node_modules/**'
					]
				}
			}
		},
		watch: {
			// Tasks for file changes should go here
		}
	});

	// Load NPM tasks
	grunt.loadNpmTasks('grunt-concurrent');     // Run grunt tasks concurrently
	grunt.loadNpmTasks('grunt-contrib-watch');  // Watches for changes to run tasks (css min, etc)
	grunt.loadNpmTasks('grunt-nodemon');        // Watches for changes to restart server (major js files)

	// Running grunt (without task arg)
	grunt.registerTask('default',
		[
			'build',
			'run'
		]
	);

	grunt.registerTask('build',
		[
			// Add any building tasks in here
			// e.g. clean, handlebars, concat, uglify, cssmin, copy
		]
	);

	grunt.registerTask('run',
		[
			'concurrent'
		]
	);
};