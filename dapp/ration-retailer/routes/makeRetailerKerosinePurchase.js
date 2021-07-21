const express = require('express');
const { ClientApplication } = require('./Client')

const makeRetailerKerosinePurchase = express.Router();

makeRetailerKerosinePurchase.get('/', (req, res) => {
  res.render('makeRetailerKerosinePurchase', {
    title: 'RATION RETAILER DASHBOARD',
    subTitle: 'MAKE RETAILER KEROSINE PURCHASE'
  });
});

makeRetailerKerosinePurchase.post('/submit', (req, res) => {
  console.log(req.body);
  let retailerPurchaseNumber = req.body.retailerPurchaseNumber;
  let rationRetailerId = req.body.rationRetailerId;
  
  let RationRetailerClient = new ClientApplication();
  RationRetailerClient.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
  RationRetailerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  RationRetailerClient.generatedAndSubmitTxn(
    'makeRetailerKerosinePurchase',
    retailerPurchaseNumber,
    rationRetailerId
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'MAKE RETAILER KEROSINE PURCHASE',
      msg: `MADE RETAILER KEROSINE PURCHASE WITH ID ${retailerPurchaseNumber}.`
    });
  });
});

module.exports = makeRetailerKerosinePurchase;