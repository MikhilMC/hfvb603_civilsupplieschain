const express = require('express');
const { ClientApplication } = require('./Client')

const readFamilyPurchases = express.Router();

readFamilyPurchases.post('/', (req, res) => {
  // console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber3;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'getConsumerPurchases',
    rationCardNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    res.render('readFamilyPurchases', {
      title: 'RATION CARD DASHBOARD',
      subTitle: 'READ FAMILY MEMBERS',
      purchases: data
    });
  });
})

module.exports = readFamilyPurchases;