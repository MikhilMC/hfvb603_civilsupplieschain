const express = require('express');
const { ClientApplication } = require('./Client');

const shiftFamilyInSameLSGBody = express.Router();

shiftFamilyInSameLSGBody.get('/', (req, res) => {
  res.render('shiftFamilyInSameLSGBody', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'SHIFT THE HOME IN SAME LSG BODY'
  })
});

shiftFamilyInSameLSGBody.post('/submit', (req, res) => {
  console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber;
  let newHouseNumber = req.body.newHouseNumber;
  let newRationRetailerId = req.body.newRationRetailerId;
  let isNewHomeElectrified = req.body.isNewHomeElectrified;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'shiftHouseInSameLSGBody',
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId,
    isNewHomeElectrified === 'yes'? 'true': 'false'
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'SHIFT HOUSE IN THE SAME LSG BODY',
      msg: `RATION CARD ${rationCardNumber} HAVE BEEN SHIFTED TO NEW HOUSE IN THE SAME LSG BODY WITH HOUSE NUMBER ${newHouseNumber} AND NEW RETAILER ID ${newRationRetailerId}.`
    });
  });
});

module.exports = shiftFamilyInSameLSGBody;