const express = require('express');
const { ClientApplication } = require('./Client')

const readFamilyMembers = express.Router();

readFamilyMembers.post('/', (req, res) => {
  // console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber2;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'getFamilyMembers',
    rationCardNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    res.render('readFamilyMembers', {
      title: 'RATION CARD DASHBOARD',
      subTitle: 'READ FAMILY MEMBERS',
      familyMembers: data
    });
  });
})

module.exports = readFamilyMembers;