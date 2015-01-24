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
        'divshot-push': {
            development: {
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
        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false
                }]
            },
            svgFiles: {
                files: {
                    'dist/svg/card.svg': 'dist/svg/card.svg'
                }
            }
        },
        svgstore: {
            options: {
                prefix: 'card-',
                svg: {
                    viewBox: '0 0 195 293',
                    xmlns: 'http://www.w3.org/2000/svg'
                }
            },
            svgFiles: {
                files: {
                    'dist/svg/card.svg': ['src/svg/*.svg']
                }
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
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-svgstore');

    /*===============================================================
     Tasks Aliases
     ===============================================================*/

    grunt.registerTask('deploy', [
        'dist',
        'divshot-push'
    ]);
    grunt.registerTask('dist', [
        'clean',
        'cssmin',
        'uglify',
        'htmlrefs',
        'htmlmin',
        'svgstore',
        'svgmin'
    ]);
    grunt.registerTask('default', [
        'deploy'
    ]);
};