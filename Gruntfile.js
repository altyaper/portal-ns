'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
              'Gruntfile.js',
              'public/javascripts/*.js'
            ]
        },
        jscs: {
            options: {
                config: '.jscsrc',
                fix: true
            },
            files: ['<%= jshint.files %>']
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jscs','jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jscs','jshint']);

};
