const express = require('express');
const { ClientApplication } = require('./Client')

const addNewConsumer = express.Router();

addNewConsumer.get('/', (req, res) => {
  res.render('addNewConsumer', {
    title: 'NODAL OFFICER DASHBOARD',
    subTitle1: 'ADD NEW CONSUMER',
    subTitle2: 'READ CONSUMER'
  });
});

addNewConsumer.post('/submit', (req, res) => {
  // console.log(req.body);
  let consumerNumber = req.body.consumerNumber1;
  let rationCardNumber = req.body.rationCardNumber;
  let name = req.body.name;
  let age = req.body.age;
  let sex = req.body.sex;
  let occupation = req.body.occupation;
  let individualIncome = req.body.individualIncome;
  let NodalOfficerClient = new ClientApplication();
  NodalOfficerClient.setRoleAndIdentity('nodal_officer', 'nodalOfficerAdmin');
  NodalOfficerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  NodalOfficerClient.generatedAndSubmitTxn(
    'addConsumer',
    consumerNumber,
    rationCardNumber,
    name,
    age,
    sex,
    occupation,
    individualIncome
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'ADD NEW CONSUMER',
      msg: `ADDED CONSUMER WITH ID ${consumerNumber} TO THE RATION CARD ${rationCardNumber}.`
    });
  });
});

module.exports = addNewConsumer;