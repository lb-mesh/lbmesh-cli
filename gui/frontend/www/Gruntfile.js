  
  module.exports = function(grunt) {
  
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        clean: {

        },
        minified: {
            files: {
                src: [],
                dest: ''
            },
            options : {
                sourcemap: true,
                allinone: false
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
              },
              target: {
                  files: {
                      '': [

                      ]
                  }
              }            
        },
        concat: {
            basic: {
                src: [],
                dest: ''
            }
        },
        uglify: {
            options: {
                mangle: false
              },
              my_files: {
                  files: {
                      'final.min.js': [

                      ]
                  }
              }
        },
        copy: {
            main:{
                files: [
                    // includes files within path
                    {expand: true, src: ['src/theme.js'], dest: 'client/assets/admin/theme.js', filter: 'isFile'},
                    {expand: true, src: ['src/theme.css'], dest: 'client/assets/admin/theme.css', filter: 'isFile'},
                ]
            }
        },
        less: {
            development: {
                options: {
                    paths: ['assets/css']
                },
                files: {
                    'src/css/stylesheet.css': 'src/css/stylesheet.less'
                }
            }
        }
    });

        // Load the plugin that provides the "uglify" task.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-minified');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-less');

    // Task for the Inner Dashboard
    grunt.registerTask('default',['cssmin:inside']);
    //grunt.registerTask('dashboard',['cssmin:inside']);

  };