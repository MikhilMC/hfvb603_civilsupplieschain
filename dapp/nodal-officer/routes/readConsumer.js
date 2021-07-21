const express = require('express');
const { ClientApplication } = require('./Client');

const readConsumer = express.Router();

readConsumer.post('/', (req, res) => {
  // console.log(req.body);
  let consumerNumber = req.body.consumerNumber2;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'readConsumer',
    consumerNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    res.render('readConsumer', {
      title: 'NODAL OFFICER DASHBOARD',
      subTitle: 'READ RATION CARD',
      consumerNumber,
      name: data['name'],
      age: data['age'],
      sex: data['sex'],
      occupation: data['occupation'],
      individualIncome: data['individualIncome'],
      rationCardNumber: data['rationCardNumber'],
      nodalOfficerId: data['nodalOfficerId'],
      rationRetailerId: data['rationRetailerId'],
      isFamilyHead: data['isFamilyHead']
    });
  })
});

module.exports = readConsumer;