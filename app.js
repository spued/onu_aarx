var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var manageRouter = require('./routes/manage');


var dotenv = require('dotenv').config();
var app = express();

if (dotenv.error) {
  throw result.error
}

//console.log(dotenv.parsed)
console.log('Start with env = ' + process.env.NODE_ENV);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if(process.env.NODE_ENV == 'development') app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adminlte', express.static('./node_modules/admin-lte'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/manage', manageRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
