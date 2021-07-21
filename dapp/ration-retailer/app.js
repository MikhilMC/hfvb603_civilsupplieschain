var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { EventListner } = require('./routes/Events')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var makeRetailerFoodPurchase = require('./routes/makeRetailerFoodPurchase');
var makeRetailerKerosinePurchase = require('./routes/makeRetailerKerosinePurchase');
var makeConsumerPurchase = require('./routes/makeConsumerPurchase');

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
app.use('/makeRetailerFoodPurchase', makeRetailerFoodPurchase);
app.use('/makeRetailerKerosinePurchase', makeRetailerKerosinePurchase);
app.use('/makeConsumerPurchase', makeConsumerPurchase);


let RationRetailerEvent = new EventListner();
RationRetailerEvent.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
RationRetailerEvent.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');

RationRetailerEvent.contractEventListner('RationRetailerListener1', 'retailerFoodItemsPurchaseEvent');
RationRetailerEvent.contractEventListner('RationRetailerListener2', 'retailerKerosinePurchaseEvent');
RationRetailerEvent.contractEventListner('RationRetailerListener3', 'consumerPurchaseEvent');

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
