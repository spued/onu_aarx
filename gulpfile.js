'use strict';
const dotenv = require("dotenv").config();
const gnodemon = require('gulp-nodemon')
const { watch, task, series } = require('gulp');

function defaultTask(cb) {
  // place code for your default task here
  gnodemon({
      script: "./bin/www",
      require: '.env',
      ignore: ['node_modules/**','public/uploads/*.*'],
      ext: 'css js pug',
      verbose: true,
      watch: [ '*.js',
               './*.js',
               './**/*.js',
               './**/**/*.js',
               './config/*.*'
            ],
      //env: {'NODE_ENV': 'development'}
    });
  cb();
}

exports.default = defaultTask
