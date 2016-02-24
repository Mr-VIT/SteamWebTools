module.exports = function(grunt) {

	grunt.initConfig({

		clean: {
			build: ['release/']
		},

		includes: {
			build: {
				files: {
					'release/steamwebtools.full.js': ['src/steamwebtools.user.js'],
					'release/version.js': ['src/version.js']
				},
				flatten: true,
				options: {
					includeRegexp: /^(\s*)\/\/!include\s+(\S+)\s*$/
				}
			}
		},

		uglify: {
			options: {
				preserveComments: /^\s(?:==\/?UserScript|@)/
			},
			my_target: {
				files: {
					'release/steamwebtools.user.js': ['release/steamwebtools.full.js']
				}
			},
		}

	});

	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', ['clean', 'includes', 'uglify']);
	grunt.registerTask('default', ['build']);
};