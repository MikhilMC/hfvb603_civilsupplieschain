var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { EventListner } = require('./routes/Events')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var createNodalOfficer = require('./routes/createNodalOfficer');
var readNodalOfficer = require('./routes/readNodalOfficer');
var createRationRetailer = require('./routes/createRationRetailer');
var readRationRetailer = require('./routes/readRationRetailer');
var shiftFamilyToAnotherTaluk = require('./routes/shiftFamilyToAnotherTaluk');
var shiftConsumerToAnotherRationCard = require('./routes/shiftConsumerToAnotherRationCard');

var app = express();

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
app.use('/createNodalOfficer', createNodalOfficer);
app.use('/readNodalOfficer', readNodalOfficer);
app.use('/createRationRetailer', createRationRetailer);
app.use('/readRationRetailer', readRationRetailer);
app.use('/shiftFamilyToAnotherTaluk', shiftFamilyToAnotherTaluk);
app.use('/shiftConsumerToAnotherRationCard', shiftConsumerToAnotherRationCard);

let CommisionerEvent = new EventListner();
CommisionerEvent.setRoleAndIdentity('commisioner', 'commisionerAdmin');
CommisionerEvent.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');

CommisionerEvent.contractEventListner('CommisionerListener1', 'createNodalOfficerEvent');
CommisionerEvent.contractEventListner('CommisionerListener2', 'createRationRetailerEvent');
CommisionerEvent.contractEventListner('CommisionerListener3', 'shiftFamilyToAnotherTalukEvent');
// CommisionerEvent.contractEventListner('CommisionerListener4', 'shiftConsumerToAnotherFamilyEvent');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
