const express = require('express');
const { ClientApplication } = require('./Client')

const deleteRationCard = express.Router();

deleteRationCard.get('/', (req, res) => {
  res.render('deleteConsumer', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'DELETE CONSUMER'
  });
});

deleteRationCard.post('/submit', (req, res) => {
  console.log(req.body);
  let consumerNumber = req.body.consumerNumber;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'deleteConsumer',
    consumerNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'DELETE CONSUMER',
      msg: `CONSUMER HAVE BEEN DELETED OF ID ${consumerNumber}.`
    });
  });
})

module.exports = deleteRationCard;