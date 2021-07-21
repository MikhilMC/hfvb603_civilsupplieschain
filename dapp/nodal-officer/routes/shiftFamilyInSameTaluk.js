const express = require('express');
const { ClientApplication } = require('./Client');

const shiftFamilyInSameWard = express.Router();

shiftFamilyInSameWard.get('/', (req, res) => {
  res.render('shiftFamilyInSameTaluk', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'SHIFT THE HOME IN SAME TALUK'
  })
});

shiftFamilyInSameWard.post('/submit', (req, res) => {
  console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber;
  let newHouseNumber = req.body.newHouseNumber;
  let newRationRetailerId = req.body.newRationRetailerId;
  let isNewHomeElectrified = req.body.isNewHomeElectrified;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'shiftHouseInSameTaluk',
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId,
    isNewHomeElectrified === 'yes'? 'true': 'false'
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'SHIFT HOUSE IN THE SAME WARD',
      msg: `RATION CARD ${rationCardNumber} HAVE BEEN SHIFTED TO NEW HOUSE IN THE SAME TALUK WITH HOUSE NUMBER ${newHouseNumber} AND NEW RETAILER ID ${newRationRetailerId}.`
    });
  });
});

module.exports = shiftFamilyInSameWard;