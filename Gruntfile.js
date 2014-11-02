module.exports = function(grunt) {
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-watch',
    'grunt-contrib-sass',
    'grunt-contrib-jasmine'
  ];

  var config = {};

  // =============================================
  // jshint
  config.jshint = {};
  config.jshint.options = {
    debug: true
  };
  config.jshint.all = [
    'assets/javascripts/src/**/*.js'
  ];

  // =============================================
  // concat
  config.concat = {
    dist: {
      src: [
        'assets/javascripts/src/app/app.js',
        'assets/javascripts/src/**/*.js'
      ],
      dest: 'assets/javascripts/app.js'
    }
  };

  // =============================================
  // watch
  config.watch = {};
  config.watch.scripts = {
    files: [
      'assets/javascripts/src/app.js',
      'assets/javascripts/src/**/*.js',
      'assets/stylesheets/src/*.sass'
    ],
    tasks: ['jshint', 'concat', 'sass'],
    options: {
      spawn: false,
    }
  };

  // =============================================
  // sass
  config.sass = {};
  config.sass.dist = {
    options: {
      style: 'expanded'
    },
    files: {
      'assets/stylesheets/main.css': 'assets/stylesheets/src/main.css.sass'
    }
  };

  // =============================================
  // jasmine
  config.jasmine = {};
  config.jasmine.pivotal = {
    src: [
      'bower_components/jquery/dist/jquery.js',
      'assets/javascripts/app.js'
    ],
    options: {
      specs: 'tests/**/*Spec.js'
    }
  }

  // =============================================
  // config
  grunt.initConfig(config);

  // Load all tasks
  tasks.forEach(grunt.loadNpmTasks);
};
