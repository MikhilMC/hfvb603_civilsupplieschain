const express = require('express');
const { ClientApplication } = require('./Client');

const readConsumerPurchase = express.Router();

readConsumerPurchase.post('/', (req, res) => {
  // console.log(req.body);
  let consumerPurchaseNumber = req.body.consumerPurchaseNumber2;
  let RationRetailerClient = new ClientApplication();
  RationRetailerClient.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
  RationRetailerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  RationRetailerClient.generatedAndSubmitTxn(
    'readConsumerPurchase',
    consumerPurchaseNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    res.render('readConsumerPurchase', {
      title: 'RATION RETAILER DASHBOARD',
      subTitle: 'READ CONSUMER PURHCASE',
      consumerPurchaseNumber,
      retailerPurchaseNumber: data['retailerPurchaseNumber'],
      nodalOfficerId: data['nodalOfficerId'],
      rationRetailerId: data['rationRetailerId'],
      rationCardNumber: data['rationCardNumber'],
      itemName: data['itemName'],
      quantity: data['quantity'],
      pricePerQuantity: data['pricePerQuantity'],
      price: data['price'],
      purchaseDate: data['purchaseDate'],
    });
  })
});

module.exports = readConsumerPurchase;