const express = require('express');
const { ClientApplication } = require('./Client')

const makeConsumerPurchase = express.Router();

makeConsumerPurchase.get('/', (req, res) => {
  res.render('makeConsumerPurchase', {
    title: 'RATION RETAILER DASHBOARD',
    subTitle1: 'MAKE CONSUMER PURCHASE',
    subTitle2: 'READ CONSUMER PURCHASE'
  });
});

makeConsumerPurchase.post('/submit', (req, res) => {
  console.log(req.body);
  let consumerPurchaseNumber = req.body.consumerPurchaseNumber1;
  let retailerPurchaseNumber = req.body.retailerPurchaseNumber;
  let rationCardNumber = req.body.rationCardNumber;
  
  let RationRetailerClient = new ClientApplication();
  RationRetailerClient.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
  RationRetailerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  RationRetailerClient.generatedAndSubmitTxn(
    'makeConsumerPurchase',
    consumerPurchaseNumber,
    retailerPurchaseNumber,
    rationCardNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'MAKE CONSUMER FOOD PURCHASE',
      msg: `MADE CONSUMER PURCHASE WITH ID ${retailerPurchaseNumber}.`
    });
  });
});

module.exports = makeConsumerPurchase;