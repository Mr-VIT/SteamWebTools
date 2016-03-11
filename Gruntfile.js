module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
			build: {
				src: 'release/steamwebtools.full.js',
				dest: 'release/steamwebtools.user.js'
			},
		}

	});

	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask( "genverfile", "Generate _version.js", function() {
		var v = grunt.config('pkg').version,
			d = grunt.template.today("yyyy-mm-dd");
		grunt.file.write('src/_version.js', '// @version		'+v+'\n// @date		'+d);
		
		grunt.log.writeln('Generated _version.js : '+d+' '+v);
	});
	
	
	grunt.registerTask('build', ['genverfile', 'clean', 'includes', 'uglify']);
	grunt.registerTask('default', ['build']);
};