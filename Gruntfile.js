'use strict';

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'server.js', 'test/**/*.js','app/js/**/*.js']
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

    copy: {
      all: {
        expand: true,
        cwd: 'app/',
        src: ['css/*.css', '*.html', 'images/**/*'],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
    },

    browserify: {
      all: {
        src: 'app/js/**/*.js',
        dest: 'dist/app.js'
      },
      options: {
        transform: [/*'debowerify', 'hbsfy'*/],
        debug: true
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
          node_env: 'production'
        }
      }
    },

    watch: {
      scripts: {
        files: ['app/js/**/*.js','test/**/*.js']
      }
    }
  });

  grunt.registerTask('serve', ['build', 'express:dev','watch']);
  grunt.registerTask('server', 'serve');
  grunt.registerTask('build', ['clean', 'browserify', 'copy']);
  grunt.registerTask('test:acceptance',['express:dev','casper']);
  grunt.registerTask('test:api','simplemocha');
  grunt.registerTask('test',['test:acceptance','test:api']);
  grunt.registerTask('default', ['jshint', 'test']);
};
