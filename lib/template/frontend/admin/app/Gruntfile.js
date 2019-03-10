  
  module.exports = function(grunt) {
  

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            js: ['client/assets/admin/theme.js','client/assets/dashboard.js'],
            css: ['client/assets/admin/theme.css','client/assets/dashboard.css']
        },
        minified : {
            files: {
              src: [
                'src/plugins/pace/pace.min.js',
                'src/plugins/jquery/jquery-1.9.1.min.js',
                'src/plugins/jquery/jquery-migrate-1.1.0.min.js',
                'src/plugins/jquery-ui/ui/minified/jquery-ui.min.js',
                'src/plugins/bootstrap/js/bootstrap.min.js',
                'src/plugins/slimscroll/jquery.slimscroll.min.js',
                'src/js/parsley.min.js',
                'src/plugins/jquery-cookie/jquery.cookie.js',
                'src/plugins/gritter/js/jquery.gritter.js',
                'src/js/demo.final.min.js',
                'src/js/apps.final.min.js'
              ],
              dest: 'client/assets/admin/theme.js'
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
                'client/assets/admin/theme.css': [
                    'src/plugins/jquery-ui/themes/base/minified/jquery-ui.min.css', 
                    'src/plugins/bootstrap/css/bootstrap.min.css',
                    'src/plugins/gritter/css/jquery.gritter.css',
                    'src/plugins/bootstrap-select/bootstrap-select.min.css',
                    'src/plugins/select2/dist/css/select2.min.css',
                    'src/plugins/jquery-tag-it/css/jquery.tagit.css',
                    'src/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css',
                    'src/plugins/strength-js/strength.css',
                    'src/plugins/font-awesome/css/font-awesome.min.css',
                    'src/css/animate.min.css'
                ]
              },
            },
            dashboard: {
                files: {
                    'client/assets/admin/dashboard.css': [
                        'src/plugins/jquery-ui/themes/base/minified/jquery-ui.min.css', 
                        'src/plugins/bootstrap/css/bootstrap.min.css',
                        'src/plugins/font-awesome/css/font-awesome.min.css',
                        'src/plugins/gritter/css/jquery.gritter.css',
                        'src/css/animate.min.css',
                        'src/plugins/summernote/dist/summernote.css',
                        'src/plugins/bootstrap-select/bootstrap-select.min.css',
                        'src/plugins/select2/dist/css/select2.min.css',
                        'src/plugins/jquery-tag-it/css/jquery.tagit.css',
                        'src/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css',
                        'src/plugins/strength-js/strength.css',
                        'src/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                        'src/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css'                 
                    ]                 
                }
            },
            stylesheet: {
              files: {
                'client/assets/admin/stylesheet.min.css': [
                    'src/css/stylesheet.css'
                ]
              }
            }
          },
          concat: {
            basic: {
              src: [
                'src/plugins/pace/pace.min.js',
                'src/plugins/jquery/jquery-1.9.1.min.js',
                'src/plugins/jquery/jquery-migrate-1.1.0.min.js',
                'src/plugins/jquery-ui/ui/minified/jquery-ui.min.js',
                'src/plugins/bootstrap/js/bootstrap.min.js',
                'src/plugins/gritter/js/jquery.gritter.js',
                'src/plugins/slimscroll/jquery.slimscroll.min.js',
                'src/js/parsley.min.js',
                'src/plugins/jquery-tag-it/js/tag-it.min.js',
                'src/plugins/strength-js/strength.js',
                'src/plugins/masked-input/masked-input.min.js',
                'src/plugins/bootstrap-tagsinput/bootstrap-tagsinput.min.js',
                'src/plugins/jquery-cookie/jquery.cookie.js',
                'src/js/apps.final.min.js',
                'src/js/form.min.js',
                'src/js/demo.final.min.js'
              ],
              dest: 'client/assets/admin/theme.js',
            },
            inside: {
                src: [
                    'src/js/jquery-2.1.4.min.js',                  
                    'src/plugins/pace/pace.min.js',
                    'src/plugins/jquery/jquery-migrate-1.1.0.min.js',
                    'src/plugins/jquery-ui/ui/minified/jquery-ui.min.js',
                    'src/plugins/bootstrap/js/bootstrap.min.js',
                    'src/plugins/slimscroll/jquery.slimscroll.min.js',
                    'src/plugins/gritter/js/jquery.gritter.js',
                    'src/plugins/jquery-tag-it/js/tag-it.min.js',
                    'src/plugins/strength-js/strength.js',
                    'src/plugins/masked-input/masked-input.min.js',
                    'src/plugins/bootstrap-calendar/js/bootstrap_calendar.min.js',
                    'src/plugins/DataTables/media/js/jquery.dataTables.js',
                    'src/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                    'src/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                    'src/plugins/fullcalendar/lib/moment.min.js',
                    'src/js/underscore-min.js',
                    'src/js/page-form-wysiwyg.demo.min.js',
                    'src/plugins/summernote/dist/summernote.min.js',
                    'src/js/parsley.min.js',
                    'src/src/plugins/jquery-cookie/jquery.cookie.js',
                    'src/js/apps.final.min.js',
                    'src/js/form.min.js',
                    'src/js/demo.final.min.js'
                ],
                dest: 'client/assets/admin/dashboard.js',
            }
          },
          uglify: {
            options: {
              mangle: false
            },
            my_formjs:{
              files: {
                'src/js/form.min.js': [
                  'src/js/page-form-plugins.demo.js'
                ]
              }
            },
            my_theme: {
              files: {
                'src/js/demo.final.min.js': [
                  'src/js/demo.js'
                ]
              }
            },
            my_dashboard: {
              files: {
                'src/js/apps.final.min.js': [
                  'src/js/apps.js'
                ]
              }                
            },
            my_target: {
              files: {
                'client/assets/admin/theme.js': [
                    'plugins/pace/pace.min.js',
                    'src/plugins/jquery/jquery-1.9.1.min.js',
                    'src/plugins/jquery/jquery-migrate-1.1.0.min.js',
                    'src/plugins/jquery-ui/ui/minified/jquery-ui.min.js',
                    'src/plugins/bootstrap/js/bootstrap.min.js',
                    'src/plugins/slimscroll/jquery.slimscroll.min.js',
                    'src/js/parsley.min.js',
                    'src/plugins/jquery-cookie/jquery.cookie.js',
                    'src/js/demo.final.min.js',
                    'src/js/form.min.js',
                    'src/js/apps.final.min.js'
                ]
              }
            }
          },
          copy: {
            main: {
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
          }}
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-minified');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    // A very basic default task.
    grunt.registerTask('default', ['clean','uglify:my_dashboard','uglify:my_theme','uglify:my_formjs','cssmin:target','cssmin:dashboard','concat:basic','concat:inside','less','cssmin:stylesheet']);
     
    // Task for the Inner Dashboard
    //grunt.registerTask('dashboard',['cssmin:inside']);

};