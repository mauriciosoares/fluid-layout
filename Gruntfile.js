module.exports = function(grunt) {
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-watch',
    'grunt-contrib-sass',
    'grunt-contrib-cssmin'
  ];

  var config = {};

  // =============================================
  // jshint
  config.jshint = {};
  config.jshint.options = {
    debug: true
  };
  config.jshint.all = ['assets/javascripts/src/*.js'];

  // =============================================
  // concat
  config.concat = {
    dist: {
      src: [
        'assets/javascripts/src/*.js',
      ],
      dest: 'assets/javascripts/app.js'
    }
  };

  // =============================================
  // watch
  config.watch = {};
  config.watch.scripts = {
    files: ['assets/javascripts/src/*.js'],
    tasks: ['jshint', 'concat'],
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
      'assets/stylesheets/main.css': 'assets/stylesheets/main.css.sass'
    }
  };

  // =============================================
  // config
  grunt.initConfig(config);

  // Load all tasks
  tasks.forEach(grunt.loadNpmTasks);
};
