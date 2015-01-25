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
                        cwd: 'src/audio',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/audio'
                    },
                    {
                        expand: true,
                        cwd: 'src/bower_components',
                        filter: 'isFile',
                        src: ['**/*', '!**/*.md'],
                        dest: 'dist/bower_components'
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
                        cwd: 'src/css/vendor',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/css/vendor'
                    },
                    {
                        expand: true,
                        cwd: 'src/img',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/img'
                    },
                    {
                        expand: true,
                        cwd: 'src/js/vendor',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/js/vendor'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                banner: '<%= vars.banner %>',
                keepSpecialComments: 0,
                report: 'min'
            },
            cssFiles: {
                src: ['src/css/main.css'],
                dest: 'dist/css/app.min.css'
            },
            webComponentsCssFiles: {
                src: 'src/css/card.css',
                dest: 'dist/css/card.css'
            }
        },
        'divshot:push': {
            development: {
            },
            production: {
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
                    'dist/custom_web_components/card.html': 'src/custom_web_components/card.html',
                    'dist/templates/create.tpl.html': 'src/templates/create.tpl.html',
                    'dist/templates/game.tpl.html': 'src/templates/game.tpl.html',
                    'dist/templates/home.tpl.html': 'src/templates/home.tpl.html',
                    'dist/templates/join.tpl.html': 'src/templates/join.tpl.html',
                    'dist/templates/players.tpl.html': 'src/templates/players.tpl.html',
                    'dist/templates/winner.tpl.html': 'src/templates/winner.tpl.html',
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
        jsonmin: {
            jsonFiles: {
                options: {
                    stripComments: true,
                    stripWhitespace: true
                },
                files: {
                    'dist/data/data.en.json': 'src/data/data.en.json',
                    'dist/data/data.es.json': 'src/data/data.es.json'
                }
            }
        },
        svgmin: {
            options: {
                plugins: [{
                    cleanupIDs: false,
                    removeViewBox: false
                }]
            },
            svgFiles: {
                files: {
                    'dist/svg/back.svg': 'src/svg/back.svg',
                    'dist/svg/bean.svg': 'src/svg/bean.svg',
                    'dist/svg/card.svg': 'src/svg/card.svg',
                    'dist/svg/win.svg': 'src/svg/win.svg'
                }
            },
            cardsSvgFiles: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/svg/cards',
                        filter: 'isFile',
                        src: ['**'],
                        dest: 'dist/svg/cards'
                    }
                ]
            }
        },
        svgstack: {
            options: {
                cleanup: ['viewBox'],
                formatting: {
                    indent_char: " ",
                    indent_size : 4
                },
                includeTitleElement: false,
                prefix: 'c',
                svg: {
                    viewBox: '0 0 195 293',
                    xmlns: 'http://www.w3.org/2000/svg'
                }
            },
            svgFiles: {
                files: {
                    'src/svg/card.svg': ['src/svg/cards/*.svg']
                }
            }
        },
        uglify: {
            options: {
                beautify: false,
                compress: {
                    drop_console: true
                },
                mangle: false,
                preserveComments: false,
                report: 'min'
            },
            jsFiles: {
                options: {
                    banner: '<%= vars.banner %>' + grunt.util.linefeed
                },
                files: {
                    'dist/js/app.min.js': [
                        'src/js/main.js',
                        'src/js/ngEnter.js',
                        'src/js/gamestate.js',
                        'src/js/messageService.js',
                        'src/js/homeController.js',
                        'src/js/createController.js',
                        'src/js/joinController.js',
                        'src/js/playersController.js',
                        'src/js/gameController.js',
                        'src/js/winnerController.js',
                        'src/js/utils.js'
                    ]
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
    grunt.loadNpmTasks('grunt-jsonmin');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-svgstore');

    grunt.loadTasks('tasks');

    /*===============================================================
     Tasks Aliases
     ===============================================================*/

    grunt.registerTask('deploydev', [
        'dist',
        'divshot:push:development'
    ]);
    grunt.registerTask('deployprod', [
        'dist',
        'divshot:push:production'
    ]);
    grunt.registerTask('dist', [
        'clean',
        'htmlrefs',
        'htmlmin',
        'jsonmin',
        'cssmin',
        'uglify',
        'svgstack',
        'svgmin',
        'copy'
    ]);
    grunt.registerTask('default', [
        'dist'
    ]);
};