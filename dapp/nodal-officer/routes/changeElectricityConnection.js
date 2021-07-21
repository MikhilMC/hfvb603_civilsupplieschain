const express = require('express');
const { ClientApplication } = require('./Client');

const changeElectricityConnection = express.Router();

changeElectricityConnection.get('/', (req, res) => {
  res.render('changeElectricityConnection', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'CHANGE ELECTRICITY CONNECTION STATUS'
  })
});

changeElectricityConnection.post('/submit', (req, res) => {
  console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'changeHomeElectrificationStatus',
    rationCardNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'CHANGE MOBILE NUMBER',
      msg: `ELECTRICITY CONNECTION STATUS OF THE RATION CARD ${rationCardNumber} HAVE BEEN CHANGED.`
    });
  });
});

module.exports = changeElectricityConnection;