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
                    'src/js/tools.js',
                    'src/js/plugin.js',
                    'src/js/outro.js'
                ],
                dest: 'dist/jquery-tickets-plugin.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);
};