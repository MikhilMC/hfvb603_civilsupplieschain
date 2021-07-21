const express = require('express');
const { ClientApplication } = require('./Client')

const updateProfessionalDetails = express.Router();

updateProfessionalDetails.get('/', (req, res) => {
  res.render('updateProfessionalDetails', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'UPDATE CONSUMER PROFESSIONAL DETAILS'
  });
});

updateProfessionalDetails.post('/submit', (req, res) => {
  console.log(req.body);
  let consumerNumber = req.body.consumerNumber;
  let newOccupation = req.body.newOccupation;
  let newIndividualIncome = req.body.newIndividualIncome;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'updateConsumerProfessionalDetails',
    consumerNumber,
    newOccupation,
    newIndividualIncome
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'UPDATE CONSUMER PROFESSIONAL DETAILS',
      msg: `THE PROFESSIONAL DETAILS OF THE CONSUMER WITH ID ${consumerNumber} HAD BEEN UPDATED.`
    });
  });
});

module.exports = updateProfessionalDetails;