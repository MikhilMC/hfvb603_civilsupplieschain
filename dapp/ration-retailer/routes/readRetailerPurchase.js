const express = require('express');
const { ClientApplication } = require('./Client');

const readRetailerPurchase = express.Router();

readRetailerPurchase.post('/', (req, res) => {
  // console.log(req.body);
  let retailerPurchaseNumber = req.body.retailerPurchaseNumber2;
  let RationRetailerClient = new ClientApplication();
  RationRetailerClient.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
  RationRetailerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  RationRetailerClient.generatedAndSubmitTxn(
    'readRetailerPurchase',
    retailerPurchaseNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    // res.render('readRetailerPurchase', {
    //   title: 'NODAL OFFICER DASHBOARD',
    //   subTitle: 'READ RATION CARD',
    //   consumerNumber,
    //   name: data['name'],
    //   age: data['age'],
    //   sex: data['sex'],
    //   occupation: data['occupation'],
    //   individualIncome: data['individualIncome'],
    //   rationCardNumber: data['rationCardNumber'],
    //   nodalOfficerId: data['nodalOfficerId'],
    //   rationRetailerId: data['rationRetailerId'],
    //   isFamilyHead: data['isFamilyHead']
    // });
  })
});

module.exports = readRetailerPurchase;