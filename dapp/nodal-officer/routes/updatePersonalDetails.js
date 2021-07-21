const express = require('express');
const { ClientApplication } = require('./Client')

const updatePersonalDetails = express.Router();

updatePersonalDetails.get('/', (req, res) => {
  res.render('updatePersonalDetails', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'UPDATE CONSUMER PERSONAL DETAILS'
  });
});

updatePersonalDetails.post('/submit', (req, res) => {
  console.log(req.body);
  let consumerNumber = req.body.consumerNumber;
  let newName = req.body.newName;
  let newAge = req.body.newAge;
  let newSex = req.body.newSex;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'updateConsumerPersonalDetails',
    consumerNumber,
    newName,
    newAge,
    newSex,
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'UPDATE CONSUMER PERSONAL DETAILS',
      msg: `THE PERSONAL DETAILS OF THE CONSUMER WITH ID ${consumerNumber} HAD BEEN UPDATED.`
    });
  });
});

module.exports = updatePersonalDetails;