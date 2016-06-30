'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'src/intro.js',
                    'src/constants.js',

                    'src/outro.js'
                ],
                dest: 'dist/jquery-tickets-plugin.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat:dist']);
};