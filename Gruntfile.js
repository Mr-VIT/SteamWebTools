module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['release/', '_tmp/']
		},

		includes: {
			build: {
				files: {
					'_tmp/steamwebtools.js': ['src/steamwebtools.js'],
					'release/version.gm.js': ['src/version.gm.js'],
					'release/version.tm.js': ['src/version.tm.js'],
				},
				flatten: true,
				options: {
					includeRegexp: /^(\s*)\/\/!include\s+(\S+)\s*$/
				}
			}
		},

		uglify: {
			options: {
				preserveComments: /^\s(?:==\/?UserScript|@)/,
				compress: {
					global_defs: {
						'DEBUG': false
					}
				}
			},
			build: {
				src: '_tmp/steamwebtools.js',
				dest: '_tmp/steamwebtools.min.js'
			},
		},

		concat: {
			options: {separator:'\n'},
			build: {
				files: {
					'_tmp/meta.js': ['src/meta.js', 'src/meta.texts.js', 'src/meta.version.js'],

					'_tmp/meta.tm.js': ['_tmp/meta.js', 'src/meta.tm.js'],
					'release/steamwebtools.tm.user.js': ['_tmp/meta.tm.js', '_tmp/steamwebtools.min.js'],
					//'release/steamwebtools.full.tm.user.js': ['_tmp/meta.tm.js', '_tmp/steamwebtools.js'],

					'_tmp/meta.gm.js': ['_tmp/meta.js', 'src/meta.gm.js'],
					'release/steamwebtools.gm.user.js': ['_tmp/meta.gm.js', '_tmp/steamwebtools.min.js'],
					//'release/steamwebtools.full.gm.user.js': ['_tmp/meta.gm.js', '_tmp/steamwebtools.js'],
				},
			}
		},
	});

	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask( "genverfile", "Generate meta.version.js", function() {
		var config = grunt.config('pkg'),
			githubrep,
			versionBody='',
			v = config.version,
			d = grunt.template.today("yyyy-mm-dd");
		if(config.repository?.type=='git' &&
			(githubrep=config.repository.url.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/))
		) {
			// TODO gen download url
			// `https://github.com/${githubrep[1]}/${githubrep[2]}/releases/latest/download/steamwebtools.tm.user.js`

			grunt.file.write('src/meta.texts.js',
				require('fs').readdirSync('src/lang').map(file => {
					let langCode = file.replace('.json', '');
					return `// @resource	texts:${langCode}	https://raw.githubusercontent.com/${githubrep[1]}/${githubrep[2]}/v${v}/src/lang/${langCode}.json`;
				}).join('\n')
			);
			grunt.log.writeln('Generated meta.texts.js');
		}

		versionBody += `// @version		${v}\n// @date		${d}`;
		grunt.file.write('src/meta.version.js', versionBody);

		grunt.log.writeln('Generated meta.version.js : '+d+' '+v);
	});


	grunt.registerTask('build', ['genverfile', 'clean', 'includes', 'uglify', 'concat']);
	grunt.registerTask('default', ['build']);
};