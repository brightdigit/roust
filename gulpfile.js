var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    bump = require('gulp-bump'),
    jshint = require('gulp-jshint'),
    beautify = require('gulp-beautify'),
    istanbul = require("gulp-istanbul"),
    coveralls = require('gulp-coveralls'),
    coverageEnforcer = require("gulp-istanbul-enforcer");

gulp.task('default', ['lint', 'enforce-coverage']);

gulp.task('test', function (cb) {
  gulp.src(['./lib/**/*.js']).pipe(istanbul()) // Covering files
  .on('end', function () {
    gulp.src(["./test/**/*.js"]).pipe(mocha()).pipe(istanbul.writeReports()) // Creating the reports after tests runned
    .on('end', cb);
  });
});

gulp.task('clean', function () {
  return gulp.src(['public', '.tmp'], {
    read: false
  }).pipe(clean());
});

gulp.task('coveralls', ['enforce-coverage'], function () {
  return gulp.src('coverage/**/lcov.info').pipe(coveralls());
});

gulp.task('enforce-coverage', ['test'], function () {
  var options = {
    thresholds: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    coverageDirectory: 'coverage',
    rootDirectory: ''
  };
  return gulp.src(['./lib/**/*.js']).pipe(coverageEnforcer(options));
});

gulp.task('test', function (cb) {
  gulp.src(['./lib/**/*.js']).pipe(istanbul()) // Covering files
  .on('finish', function () {
    gulp.src(["./test/**/*.js"]).pipe(mocha()).pipe(istanbul.writeReports()) // Creating the reports after tests runned
    .on('finish', cb);
  });
});

gulp.task('bump', function () {
  gulp.src(['./package.json', './bower.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./lib/**/*.js', './test/**/*.js', './gulpfile.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('beautify', function () {
  gulp.src(['./lib/**/*.js', './test/**/*.js', './gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2,
    preserveNewlines: true
  })).pipe(gulp.dest('.'));
});