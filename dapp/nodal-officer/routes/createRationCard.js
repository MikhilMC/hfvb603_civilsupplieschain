const express = require('express');
const { ClientApplication } = require('./Client')

const createRationCard = express.Router();

createRationCard.get('/', (req, res) => {
  res.render('createRationCard', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle1: 'CREATE RATION CARD',
    subTitle2: 'READ RATION CARD'
  });
});

createRationCard.post('/submit', (req, res) => {
  // console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber1;
  let rationRetailerId = req.body.rationRetailerId;
  let houseNumber = req.body.houseNumber;
  let mobileNumber = req.body.mobileNumber;
  let isHomeElectrified = req.body.isHomeElectrified;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'createRationCard',
    rationCardNumber,
    rationRetailerId,
    houseNumber,
    isHomeElectrified === 'yes'? 'true': 'false',
    mobileNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'CREATE RATION CARD',
      msg: `RATION CARD HAVE BEEN CREATED WITH ID ${rationCardNumber}.`
    });
  });
});

module.exports = createRationCard;