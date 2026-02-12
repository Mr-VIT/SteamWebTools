module.exports = function(grunt) {
	grunt.util.normalizelf=s=>s; //don't change linefeeds | save concat.options.separator
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['release/', '_tmp/']
		},

		includes: {
			build: {
				files: {
					'_tmp/<%= pkg.name %>.js': ['src/<%= pkg.name %>.js'],
					//'release/version.gm.js': ['src/version.gm.js'],
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
				src: '_tmp/<%= pkg.name %>.js',
				dest: '_tmp/<%= pkg.name %>.min.js'
			},
		},

		concat: {
			options: {separator:'\n'},
			build: {
				files: {
					'_tmp/meta.js': ['src/meta.js', '_tmp/meta.texts.js', '_tmp/meta.version.js'],

					'_tmp/meta.tm.js': ['_tmp/meta.js', '_tmp/meta-update.tm.js', 'src/meta.tm.js'],
					'release/<%= pkg.name %>.tm.user.js': ['_tmp/meta.tm.js', '_tmp/<%= pkg.name %>.min.js'],
					//'release/<%= pkg.name %>.full.tm.user.js': ['_tmp/meta.tm.js', '_tmp/<%= pkg.name %>.js'],

					//'_tmp/meta.gm.js': ['_tmp/meta.js', 'src/meta.gm.js'],
					//'release/<%= pkg.name %>.gm.user.js': ['_tmp/meta.gm.js', '_tmp/<%= pkg.name %>.min.js'],
					//'release/<%= pkg.name %>.full.gm.user.js': ['_tmp/meta.gm.js', '_tmp/<%= pkg.name %>.js'],
				},
			}
		},
	});

	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	let forLocalUse=true;
	grunt.registerTask( "genmetafiles", "Generate meta files", function() {
		var config = grunt.config('pkg'),
			versionBody='',
			v = config.version,
			d = grunt.template.today("yyyy-mm-dd");

		let githubrep = config.repository?.url?.match(/github\.com\/(.+?\/.+?)(?:\.git)?$/)?.[1];

		forLocalUse ||= !githubrep;

		let linkPrefix;
		if(forLocalUse){
			grunt.log.writeln('Links will be set to local');
			linkPrefix = 'file://'+__dirname
		}

		if(!forLocalUse && githubrep) {
			linkPrefix = `https://raw.githubusercontent.com/${githubrep}/v${v}`

			grunt.file.write('_tmp/meta-update.tm.js', `// @updateURL	https://github.com/${githubrep}/releases/latest/download/version.tm.js`);
			versionBody = `// @downloadURL https://github.com/${githubrep}/releases/latest/download/${grunt.template.process('<%= pkg.name %>')}.tm.user.js\n`; // tm only

		}
		let metaTextsBody;

		metaTextsBody = require('fs').readdirSync('src/lang').map(file => {
			let langCode = file.replace('.json', '');
			return `// @resource	texts:${langCode}	${linkPrefix}/src/lang/${langCode}.json`
		}).join('\n');


		grunt.file.write('_tmp/meta.texts.js', metaTextsBody);
		grunt.log.writeln('Generated meta.texts.js'+(forLocalUse?' (Set links to local)':''));

		versionBody += `// @version		${v}\n// @date		${d}`;
		grunt.file.write('_tmp/meta.version.js', versionBody);

		grunt.log.writeln('Generated meta.version.js : '+d+' '+v);
	});

	[	{
			suffix:	'local',
			arg:	true
		},{
			suffix:	'github',
			arg:	false
		},
	].forEach(opt=>{
		grunt.registerTask( "setlinks-"+opt.suffix, `Set ${opt.suffix} links`,
			()=> {forLocalUse = opt.arg}
		);
	});


	grunt.registerTask('build', 		['clean', 'genmetafiles', 'includes', 'uglify', 'concat']);
	grunt.registerTask('build:github',	['setlinks-github', 'build']);
	grunt.registerTask('default', ['build']);
};