'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
              'Gruntfile.js',
              'public/javascripts/*.js',
              'test/*.js'
            ]
        },
        uglify: {
            files: {
              'public/dest/minified.js': ['public/javascripts/*.js']
          }
        },
        cssmin: {
            target: {
                files: {
                    'public/stylesheets/styles.min.css': ['public/stylesheets/*.css']
                }
            }
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
            tasks: ['jscs','jshint','uglify','cssmin']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['jscs','jshint']);
    grunt.registerTask('rebuild', ['cssmin']);

};
