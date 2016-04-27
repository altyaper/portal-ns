'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: ['public/javascripts/portal.js', 'public/javascripts/main.js'],
                dest: 'public/javascripts/portal.min.js'
            },
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
              'Gruntfile.js',
              'public/javascripts/main.js',
              'public/javascripts/portal.js',
              'test/*.js'
            ]
        },
        uglify: {
            dist: {
                files: {
                    'public/javascripts/portal.min.js': ['public/javascripts/portal.min.js']
                }
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
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/*.js']
            }
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['jscs','jshint']);
    grunt.registerTask('rebuild', ['cssmin','concat','uglify']);
    grunt.registerTask('travis', ['default','mochaTest']);

};
