require('./Models/bdd');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var manage_bdd = require('./routes/manage_bdd');

var cookieParser = (require('cookie-parser'))
var cors = require('cors')
var session = require("express-session");
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload');

var app = express();
app.use(bodyParser.json({ limit: '5mb' }))
app.use(cors({credentials: true, origin: 'http://localhost:3001'}))
app.use(
  session({ 
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: false,
  saveUninitialized: false,
  })
 );
app.use(cookieParser());
app.use(fileUpload());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/manage_bdd', manage_bdd);

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
