const express = require('express');
const { ClientApplication } = require('./Client');

const shiftFamilyToAnotherTaluk = express.Router();

shiftFamilyToAnotherTaluk.get('/', (req, res) => {
  res.render('shiftFamilyToAnotherTaluk', {
    title: 'COMMISIONER DASHBOARD',
    subTitle: 'SHIFT HOUSE TO ANOTHER TALUK'
  })
});

shiftFamilyToAnotherTaluk.post('/submit', (req, res) => {
  console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber;
  let newHouseNumber = req.body.newHouseNumber;
  let newRationRetailerId = req.body.newRationRetailerId;
  let isNewHomeElectrified = req.body.isNewHomeElectrified;
  let CommisionerClient = new ClientApplication();
  CommisionerClient.setRoleAndIdentity('commisioner', 'commisionerAdmin');
  CommisionerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  CommisionerClient.generatedAndSubmitTxn(
    'shiftHouseToAnotherTaluk',
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId,
    isNewHomeElectrified === 'yes'? 'true': 'false'
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'SHIFT HOUSE TO ANOTHER TALUK',
      msg: `RATION CARD ${rationCardNumber} HAVE BEEN SHIFTED TO NEW HOUSE IN ANOTHER TALUK WITH HOUSE NUMBER ${newHouseNumber} AND NEW RETAILER ID ${newRationRetailerId}.`
    });
  });
});

module.exports = shiftFamilyToAnotherTaluk;