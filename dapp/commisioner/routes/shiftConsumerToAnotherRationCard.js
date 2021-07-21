const express = require('express');
const { ClientApplication } = require('./Client')

const shiftConsumerToAnotherRationCard = express.Router();

shiftConsumerToAnotherRationCard.get('/', (req, res) => {
  res.render('shiftConsumerToAnotherRationCard', {
    title: 'COMMISIONER DASHBOARD',
    subTitle: 'SHIFT CONSUMER TO ANOTHER CARD'
  });
});

shiftConsumerToAnotherRationCard.post('/submit', (req, res) => {
  console.log(req.body);
  let consumerNumber = req.body.consumerNumber;
  let newRationRetailerId = req.body.newRationRetailerId;
  let CommisionerClient = new ClientApplication();
  CommisionerClient.setRoleAndIdentity('commisioner', 'commisionerAdmin');
  CommisionerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  CommisionerClient.generatedAndSubmitTxn(
    'shiftConsumerToAnotherFamily',
    consumerNumber,
    newRationRetailerId
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'SHIFT CONSUMER TO ANOTHER CARD',
      msg: `SHIFTING A CONSUMER WITH ID ${consumerNumber} TO THE CARD ${newRationRetailerId}.`
    });
  });
});

module.exports = shiftConsumerToAnotherRationCard;