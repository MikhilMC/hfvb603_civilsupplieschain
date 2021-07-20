const express = require('express');
const { ClientApplication } = require('./Client')

const readNodalOfficer = express.Router();

readNodalOfficer.post('/', (req, res) => {
  let nodalOfficerId = req.body.nodalOfficerId2;
  console.log(nodalOfficerId);
  let CommisionerClient = new ClientApplication();
  CommisionerClient.setRoleAndIdentity('commisioner', 'commisionerAdmin');
  CommisionerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  CommisionerClient.generatedAndSubmitTxn(
    'readNodalOfficer',
    nodalOfficerId
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    return JSON.parse(result);
  }).then(data => {
    res.render('readNodalOfficer', {
      title: 'COMMISIONER DASHBOARD',
      subTitle: 'READ NODAL OFFICER',
      nodalOfficerId: nodalOfficerId,
      district: data['district'],
      taluk: data['taluk']
    })
  })
});

module.exports = readNodalOfficer;