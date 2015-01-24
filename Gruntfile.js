module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    grunt.config.init({

        /*===============================================================
         Variables
         ===============================================================*/

        vars: {
            pkg: pkg,
            versionBuild: 'v<%= vars.pkg.version %>-b<%= grunt.template.today("yyyy.mm.dd.HH.MM") %>',
            banner: '/*! <%= vars.pkg.name %> <%= vars.versionBuild %> <%= vars.pkg.author %> */'
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
        copy: {
            toTmpFolder: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/bower_components',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/bower_components'
                    },
                    {
                        expand: true,
                        cwd: 'src/js/vendor',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/js/vendor'
                    },
                    {
                        expand: true,
                        cwd: 'src/css/vendor',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/css/vendor'
                    },
                    {
                        expand: true,
                        cwd: 'src/css/fonts',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/css/fonts'
                    },
                    {
                        expand: true,
                        cwd: 'src/templates',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/templates'
                    }
                ]
            }
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
                dest: 'dist/css/app.min.css'
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
                    'dist/index.html': 'dist/index.html'
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
                    'dist/svg/card.svg': 'src/svg/card.svg'
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
                    'src/svg/card.svg': ['src/svg/card.svg', 'src/svg/*.svg']
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
                    banner: '<%= vars.banner %>' + grunt.util.linefeed
                },
                files: {
                    'dist/js/app.min.js': 'src/js/*.js'
                }
            }
        }
    });

    /*===============================================================
     Tasks Loading
     ===============================================================*/

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
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

    grunt.registerTask('svgsprite', [
        'svgstore'
    ]);
    grunt.registerTask('deploy', [
        'dist',
        'divshot-push'
    ]);
    grunt.registerTask('dist', [
        'clean',
        'htmlrefs',
        'htmlmin',
        'cssmin',
        'uglify',
        'svgsprite',
        'svgmin',
        'copy'
    ]);
    grunt.registerTask('default', [
        'deploy'
    ]);
};