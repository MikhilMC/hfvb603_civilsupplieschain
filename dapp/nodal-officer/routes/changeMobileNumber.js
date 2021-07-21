const express = require('express');
const { ClientApplication } = require('./Client');

const changeMobileNumber = express.Router();

changeMobileNumber.get('/', (req, res) => {
  res.render('changeMobileNumber', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'CHANGE MOBILE NUMBER'
  })
});

changeMobileNumber.post('/submit', (req, res) => {
  console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber;
  let newMobileNumber = req.body.newMobileNumber;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'changeMobileNumber',
    rationCardNumber,
    newMobileNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'CHANGE MOBILE NUMBER',
      msg: `MOBILE NUMBER OF THE RATION CARD ${rationCardNumber} HAVE BEEN CHANGED AS ${newMobileNumber}.`
    });
  });
});

module.exports = changeMobileNumber;