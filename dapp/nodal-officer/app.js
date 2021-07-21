var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { EventListner } = require('./routes/Events')

var createRationCard = require('./routes/createRationCard');
var readRationCard = require('./routes/readRationCard');
var deleteRationCard = require('./routes/deleteRationCard');
var shiftFamilyInSameWard = require('./routes/shiftFamilyInSameWard');
var shiftFamilyInSameLSGBody = require('./routes/shiftFamilyInSameLSGBody');
var shiftFamilyInSameTaluk = require('./routes/shiftFamilyInSameTaluk');
var changeMobileNumber = require('./routes/changeMobileNumber');
var changeElectricityConnection = require('./routes/changeElectricityConnection');
var addNewConsumer = require('./routes/addNewConsumer');
var readConsumer = require('./routes/readConsumer');
var deleteConsumer = require('./routes/deleteConsumer');
var updatePersonalDetails = require('./routes/updatePersonalDetails');
var updateProfessionalDetails = require('./routes/updateProfessionalDetails');

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
app.use('/createRationCard', createRationCard);
app.use('/readRationCard', readRationCard);
app.use('/deleteRationCard', deleteRationCard);
app.use('/shiftFamilyInSameWard', shiftFamilyInSameWard);
app.use('/shiftFamilyInSameLSGBody', shiftFamilyInSameLSGBody);
app.use('/shiftFamilyInSameTaluk', shiftFamilyInSameTaluk);
app.use('/changeMobileNumber', changeMobileNumber);
app.use('/changeElectricityConnection', changeElectricityConnection);
app.use('/addNewConsumer', addNewConsumer);
app.use('/readConsumer', readConsumer);
app.use('/deleteConsumer', deleteConsumer)
app.use('/updatePersonalDetails', updatePersonalDetails);
app.use('/updateProfessionalDetails', updateProfessionalDetails);


let NodalOfficerEvent = new EventListner();
NodalOfficerEvent.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');

NodalOfficerEvent.contractEventListner('NodalOfficerListener1', 'createRationCardEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener2', 'deleteRationCardEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener3', 'addConsumerEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener4', 'deleteConsumerEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener5', 'shiftHouseInSameWardEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener6', 'shiftHouseInSameLSGBodyEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener7', 'shiftHouseInSameTalukEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener8', 'changeMobileNumberEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener9', 'changeElectricityConnectionStatusEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener10', 'updateConsumerPersonalDetailsEvent');
NodalOfficerEvent.contractEventListner('NodalOfficerListener11', 'updateConsumerProfessionalDetailsEvent');


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
