const express = require('express');
const { ClientApplication } = require('./Client')

const deleteRationCard = express.Router();

deleteRationCard.get('/', (req, res) => {
  res.render('deleteRationCard', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle: 'DELETE RATION CARD'
  });
});

deleteRationCard.post('/submit', (req, res) => {
  // console.log(req.body);
  let rationCardNumber = req.body.rationCardNumber;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'deleteRationCard',
    rationCardNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'DELETE RATION CARD',
      msg: `RATION CARD HAVE BEEN DELETED OF ID ${rationCardNumber}.`
    });
  });
})

module.exports = deleteRationCard;