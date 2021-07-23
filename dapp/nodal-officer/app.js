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


let NodalOfficerEvent1 = new EventListner();
NodalOfficerEvent1.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent1.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent1.contractEventListner('NodalOfficerListener1', 'createRationCardEvent')
.catch(err => {});

let NodalOfficerEvent2 = new EventListner();
NodalOfficerEvent2.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent2.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent2.contractEventListner('NodalOfficerListener2', 'deleteRationCardEvent')
.catch(err => {});

let NodalOfficerEvent3 = new EventListner();
NodalOfficerEvent3.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent3.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent3.contractEventListner('NodalOfficerListener3', 'addConsumerEvent')
.catch(err => {});

let NodalOfficerEvent4 = new EventListner();
NodalOfficerEvent4.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent4.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent4.contractEventListner('NodalOfficerListener4', 'deleteConsumerEvent')
.catch(err => {});

let NodalOfficerEvent5 = new EventListner();
NodalOfficerEvent5.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent5.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent5.contractEventListner('NodalOfficerListener5', 'shiftHouseInSameWardEvent')
.catch(err => {});

let NodalOfficerEvent6 = new EventListner();
NodalOfficerEvent6.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent6.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent6.contractEventListner('NodalOfficerListener6', 'shiftHouseInSameLSGBodyEvent')
.catch(err => {});

let NodalOfficerEvent7 = new EventListner();
NodalOfficerEvent7.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent7.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent7.contractEventListner('NodalOfficerListener7', 'shiftHouseInSameTalukEvent')
.catch(err => {});

let NodalOfficerEvent8 = new EventListner();
NodalOfficerEvent8.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent8.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent8.contractEventListner('NodalOfficerListener8', 'changeMobileNumberEvent')
.catch(err => {});

let NodalOfficerEvent9 = new EventListner();
NodalOfficerEvent9.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent9.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent9.contractEventListner('NodalOfficerListener9', 'changeElectricityConnectionStatusEvent')
.catch(err => {});

let NodalOfficerEvent10 = new EventListner();
NodalOfficerEvent10.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent10.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent10.contractEventListner('NodalOfficerListener10', 'updateConsumerPersonalDetailsEvent')
.catch(err => {});

let NodalOfficerEvent11 = new EventListner();
NodalOfficerEvent11.setRoleAndIdentity('nodal_officer', 'admin');
NodalOfficerEvent11.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
NodalOfficerEvent11.contractEventListner('NodalOfficerListener11', 'updateConsumerProfessionalDetailsEvent')
.catch(err => {});

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
