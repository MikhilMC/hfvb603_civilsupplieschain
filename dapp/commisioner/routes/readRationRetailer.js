const express = require('express');
const { ClientApplication } = require('./Client')

const readRationRetailer = express.Router();

readRationRetailer.post('/', (req, res) => {
  let rationRetailerId = req.body.rationRetailerId2;
  console.log(rationRetailerId);
  let CommisionerClient = new ClientApplication();
  CommisionerClient.setRoleAndIdentity('commisioner', 'commisionerAdmin');
  CommisionerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  CommisionerClient.generatedAndSubmitTxn(
    'readRationRetailer',
    rationRetailerId
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    res.render('readRationRetailer', {
      title: 'COMMISIONER DASHBOARD',
      subTitle: 'READ RATION RETAILER',
      rationRetailerId: rationRetailerId,
      nodalOfficerId: data['nodalOfficerId'],
      LSGBody: data['LSGBody'],
      wardNumber: data['wardNumber'],
      yellowCardFamilies: data['yellowCardFamilies'],
      yellowCardConsumers: data['yellowCardConsumers'],
      pinkCardConsumers: data['pinkCardConsumers'],
      blueCardConsumers: data['blueCardConsumers'],
      whiteCardConsumers: data['whiteCardConsumers'],
      electrifiedHomes: data['electrifiedHomes'],
      nonElectrifiedHomes: data['nonElectrifiedHomes']
    })
  })
});

module.exports = readRationRetailer;