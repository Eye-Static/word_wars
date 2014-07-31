'use strict';

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'server.js', 'test/**/*.js','app/**/**/*.js']
    },

    simplemocha: {
      all: { src: ['test/api/*.js'] }
    },

   casper: {
      acceptance : {
        options : {
          pre: 'node server.js',
          verbose: true,
          'log-level': 'debug',
          test : true,
        },
        files : {
          '/dev/null' : ['test/acceptance/*.js']
        }
      }
    },

    clean: ['dist'],

    concat: {
      dist: {
        src: ['app/styles/*.css', '!app/styles/signin.css'],
        dest: 'dist/style.css',
      },
    },

    copy: {
      all: {
        expand: true,
        cwd: 'app/',
        src: ['*.html', 'images/**/*'],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
    },

    browserify: {
      all: {
        src: 'app/**/*.js',
        dest: 'dist/app.js'
      },
      options: {
        transform:[
          'debowerify', 'hbsfy', //'uglifyify' //this makes the page load faster but harder to debug
        ],
        debug: true,
        external: 'jquery',
      }
    },

    express: {
      dev: {
        options: {
          background: true,
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          //node_env: 'production'
        }
      }
    },

    watch: {
      scripts: {
        files: ['app/js/**/*.js', 'app/js/templates/*.hbs'],
        tasks: 'browserify'
      },
      // server: {
      //   files: 'server.js', //this creates artifacts, not sure why
      //   tasks: 'build'
      // },
      htmlcss: {
        files:[
          'app/images/**/*', 'app/styles/**/*.css', 'app/index.html'
        ],
        tasks: ['build']
      }
    }
  });

  grunt.registerTask('serve', ['build', 'express:dev','watch']);
  grunt.registerTask('server', 'serve');
  grunt.registerTask('build', ['clean', 'browserify', 'concat', 'copy']);
  grunt.registerTask('test:acceptance',['express:dev','casper']);
  grunt.registerTask('test:api','simplemocha');
  grunt.registerTask('test', ['test:acceptance','test:api']);
  grunt.registerTask('default', ['jshint', 'test']);
};
