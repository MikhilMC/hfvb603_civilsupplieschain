const express = require('express');
const { ClientApplication } = require('./Client')

const readRationCard = express.Router();

readRationCard.post('/', (req, res) => {
  // console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber1;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'readRationCard',
    rationCardNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    res.render('readRationCard', {
      title: 'NODAL OFFICER DASHBOARD',
      subTitle: 'READ RATION CARD',
      rationCardNumber,
      nodalOfficerId: data['nodalOfficerId'],
      rationRetailerId: data['rationRetailerId'],
      district: data['district'],
      taluk: data['taluk'],
      LSGBody: data['LSGBody'],
      wardNumber: data['wardNumber'],
      doesFamilyHeadAvailable: data['doesFamilyHeadAvailable'],
      familyHead: data['familyHead'],
      familyHeadNumber: data['familyHeadNumber'],
      houseNumber: data['houseNumber'],
      isHomeElectrified: data['isHomeElectrified'],
      mobileNumber: data['mobileNumber'],
      rationCardColour: data['rationCardColour'],
      rationCardType: data['rationCardType'],
      totalFamilyIncome: data['totalFamilyIncome'],
      totalFamilyMembers: data['totalFamilyMembers']
    });
  });
})

module.exports = readRationCard;