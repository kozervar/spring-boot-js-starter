'use strict';

module.exports = function (grunt) {

    var config = require('./src/main/js/grunt/Grunt-config');

    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                options: {
                    'no-write': false
                },
                src: [
                    config.target.dir,
                    config.templates.tempDir,
                    config.templates.target
                ]
            }
        },
        copy: {
            copyTplToTemp: {
                files: [
                    {
                        cwd: config.templates.dir,
                        src: ['**/*.page.html'],
                        dest: config.templates.tempDir,
                        expand: true
                    },
                    {
                        cwd: 'src/main/js',
                        src: ['*.tpl.ejs'],
                        dest: config.templates.tempDir,
                        expand: true
                    }
                ]
            },
            copyTplTempToSrc: {
                files: [
                    {
                        cwd: config.templates.tempDir,
                        src: ['**/*.html', '!**/*.page.html'],
                        dest: config.templates.target,
                        expand: true
                    },
                    {
                        cwd: config.templates.tempDir,
                        src: ['*.compiled.js'],
                        dest: config.target.dir,
                        expand: true
                    }
                ]
            },
            buildAppJs: {
                files: [
                    {
                        src: config.appFiles.js,
                        dest: config.target.dir + '/js/',
                        expand: true
                    }
                ]
            },
            buildAppTests: {
                files: [
                    {
                        src: config.appFiles.tests,
                        dest: config.target.dir + '/js/',
                        expand: true
                    }
                ]
            },
            buildAppResources: {
                files: [{
                    src: config.appFiles.resources,
                    dest: config.target.dir + '/',
                    expand: true,
                    flatten: true
                }]
            },
            buildAppVendorJs: {
                files: [
                    {
                        src: config.appVendorFiles.js,
                        dest: config.target.dir + '/vendor/',
                        expand: true
                    }
                ]
            },
            buildAppVendorTests: {
                files: [
                    {
                        src: config.appVendorFiles.tests,
                        dest: config.target.dir + '/vendor/',
                        expand: true
                    }
                ]
            },
            buildAppVendorResources: {
                files: [{
                    src: config.appVendorFiles.resources,
                    dest: config.target.dir + '/',
                    expand: true,
                    flatten: true
                }]
            }
        },
        'process-jsp': {
            process: {
                src: ['<%= templates.tempDir %>/**/*.page.html'],
                removeExtension: 'page.html',
                fileSuffix: 'html',
                delimiters: 'square-brackets',
                scopes: [
                    {
                        name: 'appJSFiles',
                        filePath: '/js/',
                        files: [config.appFiles.js]
                    },
                    {
                        name: 'vendorJSFiles',
                        filePath: '/vendor/',
                        files: [config.appVendorFiles.js]
                    },
                    {
                        name: 'appTemplateFiles',
                        filePath: '/js/',
                        files: ['<%= target.dir %>/js/application-templates.js'],
                        flatten: true
                    },
                    {
                        name: 'appCSSFiles',
                        filePath: '/css/',
                        files: ['<%= target.dir %>/css/**/*.css'],
                        flatten: true
                    }
                ]
            },
            karma: {
                src: ['<%= templates.tempDir %>/karma.config.tpl.ejs'],
                removeExtension: '.tpl.ejs',
                fileSuffix: '.compiled.js',
                scopes: [
                    {
                        name: 'vendor',
                        files: [
                            '<%= appVendorFiles.js %>',
                            '<%= appVendorFiles.tests %>'
                        ],
                        filePath: 'vendor/'
                    },
                    {
                        name: 'application',
                        files: [
                            '<%= appFiles.js %>',
                            '<%= appFiles.tests %>'
                        ],
                        filePath: 'js/'
                    }
                ]
            }
        },
        less: {
            build: {
                files: {
                    '<%= target.dir %>/css/<%= pkg.name %>-<%= pkg.version %>.css': '<%= appFiles.less %>'
                },
                expand: true,
                flatten: true
            }
        },
        jshint: {
            src: config.appFiles.js,
            options: {
                jshintrc: true
            },
            gruntfile: [
                'Gruntfile.js'
            ]
        },
        html2js: {
            app: {
                src: ['<%= appFiles.viewTemplates %>'],
                dest: '<%= target.dir %>/js/application-templates.js',
                options: {
                    module: 'html-templates',
                    quoteChar: '\'',
                    useStrict: true,
                    rename: function (moduleName) {
                        return '/' + moduleName.replace('.html', '');
                    }
                }
            }
        },
        delta: {
            options: {
                livereload: true
            },
            appFilesJS: {
                files: '<%= appFiles.js %>',
                tasks: ['lint', 'copy:buildAppJs', 'ngAnnotate:app', 'karma:unit:run']
            },
            appFilesTests: {
                files: '<%= appFiles.tests %>',
                tasks: ['copy:buildAppTests', 'ngAnnotate:app', 'karma:unit:run']
            },
            appFilesResources: {
                files: '<%= appFiles.resources %>',
                tasks: ['copy:buildAppResources']
            },
            appTpl: {
                files: ['**/*.page.html'],
                tasks: ['copy:copyTplToTemp', 'process-jsp', 'copy:copyTplTempToSrc'],
                options: {
                    cwd: config.templates.dir
                }
            },
            appFilesLess: {
                files: '<%= appFiles.lessSrc %>',
                tasks: ['less']
            },
            appFilesViewTemplates: {
                files: '<%= appFiles.viewTemplates %>',
                tasks: ['html2js']
            }
        },
        karma: {
            options: {
                configFile: '<%= target.dir %>/karma.config.compiled.js'
            },
            unit: {
                port: 9119,
                background: true
            },
            continuous: {
                singleRun: true
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [
                    {
                        expand: true,
                        src: ['src/main/resources/static/**/*.js']
                    }
                ]
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, config));

    // Load NPM tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('src/main/js/grunt/tasks');

    // Change delimiters of lodash templates because of conflict with JSP tags
    grunt.template.addDelimiters('square-brackets', '[[', ']]');

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint']);

    // Rename watch
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'karma:unit', 'delta']);

    // Build task(s).
    grunt.registerTask('build', [
        'clean',
        'html2js',
        'lint',
        'less',
        'copy:buildAppJs',
        'copy:buildAppTests',
        'copy:buildAppResources',
        'copy:buildAppVendorJs',
        'copy:buildAppVendorTests',
        'copy:buildAppVendorResources',
        'copy:copyTplToTemp',
        'process-jsp',
        'copy:copyTplTempToSrc',
        'ngAnnotate:app',
        'karma:continuous'
    ]);

    // Default task
    grunt.registerTask('default', ['build']);

};
