const express = require('express');
const { ClientApplication } = require('./Client')

const makeRetailerFoodPurchase = express.Router();

makeRetailerFoodPurchase.get('/', (req, res) => {
  res.render('makeRetailerFoodPurchase', {
    title: 'RATION RETAILER DASHBOARD',
    subTitle1: 'MAKE RETAILER FOOD PURCHASE',
    subTitle2: 'READ RETAILER PURCHASE'
  });
});

makeRetailerFoodPurchase.post('/submit', (req, res) => {
  console.log(req.body);
  let retailerPurchaseNumber = req.body.retailerPurchaseNumber1;
  let rationRetailerId = req.body.rationRetailerId;
  let rationCardColour = req.body.rationCardColour;
  let itemName = req.body.itemName;
  
  let RationRetailerClient = new ClientApplication();
  RationRetailerClient.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
  RationRetailerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  RationRetailerClient.generatedAndSubmitTxn(
    'makeRetailerFoodItemsPurchase',
    retailerPurchaseNumber,
    rationRetailerId,
    rationCardColour,
    itemName
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'MAKE RETAILER FOOD PURCHASE',
      msg: `MADE RETAILER FOOD ITEMS PURCHASE WITH ID ${retailerPurchaseNumber}.`
    });
  });
});

module.exports = makeRetailerFoodPurchase;