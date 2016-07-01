'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    'src/js/intro.js',
                    'src/js/constants.js',
                    'src/js/utils.js',
                    'src/js/category.js',
                    'src/js/seat.js',
                    'src/js/row.js',
                    'src/js/hall.js',
                    'src/js/plugin.js',
                    'src/js/outro.js'
                ],
                dest: 'dist/jquery-tickets-plugin.js'
            }
        },

        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    'dist/jquery-tickets-plugin.css': 'src/scss/main.scss'
                }
            }
        },

        browserSync: {
            options: {
                server: {
                    baseDir: './'
                },
                port: 3445,
                watchTask: true
            },
            bsFiles: {
                src: 'dist/*.*'
            }
        },

        watch: {
            sass: {
                files: 'src/scss/*.scss',
                tasks: ['sass']
            },
            js: {
                files: 'src/js/*.js',
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['browserSync', 'watch']);
};