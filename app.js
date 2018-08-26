var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// require our routers
var indexRouter = require('./routes/index');
var urlRouter = require('./routes/url');
var shortUrlRouter = require('./routes/shortUrl');

var app = express();

// connect to database
mongoose.connect('mongodb://admin:shortensquid101@ds125472.mlab.com:25472/shorten-url', {useNewUrlParser: true});
//mongoose.connect('mongodb://admin:shortensquid101@ds125472.mlab.com:25472/shorten-url', {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open',function callback(){
   console.log("MongoDB Connection established");
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add middleware to the request handling chain
app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// serve static files at system path + public
app.use(express.static(path.join(__dirname, 'public')));

//  add our imported route-handling code to the request handling chain which
// will define routes for different parts of the site  the paths ('/' and
// '/api/shorturl/new') are treated as prefix to routes defined in the imported
// modules
app.use('/', indexRouter);
app.use('/api/shorturl/new', urlRouter);
app.use('/api/shorturl/', shortUrlRouter);

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
