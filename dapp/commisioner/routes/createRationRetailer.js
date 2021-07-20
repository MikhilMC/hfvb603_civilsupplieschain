const express = require('express');
const { ClientApplication } = require('./Client')

const createRationRetailer = express.Router();

createRationRetailer.get('/', (req, res) => {
  res.render('createRationRetailer', {
    title: 'COMMISIONER DASHBOARD',
    subTitle1: 'CREATE RATION RETAILER',
    subTitle2: 'READ RATION RETAILER'
  });
});

createRationRetailer.post('/submit', (req, res) => {
  let rationRetailerId = req.body.rationRetailerId1;
  let nodalOfficerId = req.body.nodalOfficerId;
  let LSGBody = req.body.LSGBody;
  let wardNumber = req.body.wardNumber;
  console.log(rationRetailerId, nodalOfficerId, LSGBody, wardNumber);
  let CommisionerClient = new ClientApplication();
  CommisionerClient.setRoleAndIdentity('commisioner', 'commisionerAdmin');
  CommisionerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  CommisionerClient.generatedAndSubmitTxn(
    'createRationRetailer',
    rationRetailerId,
    nodalOfficerId,
    LSGBody,
    wardNumber
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'CREATE RATION RETAILER',
      msg: `RATION RETAILER HAVE BEEN CREATED WITH ID ${rationRetailerId}.`
    });
  })
});

module.exports = createRationRetailer;