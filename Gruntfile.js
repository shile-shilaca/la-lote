module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    grunt.config.init({

        /*===============================================================
         Variables
         ===============================================================*/

        vars: {
            pkg: pkg,
            versionAndBuild: 'v<%= vars.pkg.version %>-b<%= grunt.template.today("yyyy.mm.dd.HH.MM") %>',
            banner: '/*! {{NAME}} {{VERSION}} {{AUTHOR}} */'
        },

        /*===============================================================
         Tasks
         ===============================================================*/

        clean: {
            options: {
                force: true
            },
            distFolder: [
                'dist'
            ]
        },
        cssmin: {
            options: {
                keepSpecialComments: 0,
                report: 'min'
            },
            cssFiles: {
                options: {
                    banner: '<%= vars.banner %>'
                },
                src: 'src/css/*.css',
                dest: 'dist/css/*.min.css'
            }
        },
        'divshot:push': {
            production: {
                // options
            },
            staging: {
                // options
            }
        },
        htmlmin: {
            htmlFiles: {
                options: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },
        htmlrefs: {
            htmlFiles: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            }
        },
        uglify: {
            options: {
                beautify: false,
                compress: false,
                mangle: false,
                preserveComments: false,
                report: 'min'
            },
            jsFiles: {
                options: {
                    banner: '<%= vars.banner %>' + grunt.util.linefeed,
                    mangle: {
                        except: []
                    }
                },
                files: {
                    'dist/js/main.min.js': 'src/js/*.js'
                }
            }
        }
    });

    /*===============================================================
     Tasks Loading
     ===============================================================*/

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-divshot');
    grunt.loadNpmTasks('grunt-htmlrefs');

    /*===============================================================
     Tasks Aliases
     ===============================================================*/

    grunt.registerTask('deploy', [
        'dist'
    ]);
    grunt.registerTask('dist', [
        'clean',
        'cssmin',
        'uglify',
        'htmlrefs',
        'htmlmin'
    ]);
    grunt.registerTask('default', [
        'deploy'
    ]);
};