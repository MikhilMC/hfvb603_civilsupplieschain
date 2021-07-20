const express = require('express');
const { ClientApplication } = require('./Client')

const createNodalOfficer = express.Router();

createNodalOfficer.get('/', (req, res) => {
  res.render('createNodalOfficer', {
    title: 'COMMISIONER DASHBOARD',
    subTitle1: 'CREATE NODAL OFFICER',
    subTitle2: 'READ NODAL OFFICER'
  });
});

createNodalOfficer.post('/submit', (req, res) => {
  let nodalOfficerId = req.body.nodalOfficerId1;
  let district = req.body.district;
  let taluk = req.body.taluk;
  console.log(nodalOfficerId, district, taluk);
  let CommisionerClient = new ClientApplication();
  CommisionerClient.setRoleAndIdentity('commisioner', 'commisionerAdmin');
  CommisionerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  CommisionerClient.generatedAndSubmitTxn(
    'createNodalOfficer',
    nodalOfficerId,
    district,
    taluk
  ).then(msg => {
    res.render('viewResult', {
      title: 'VIEW RESULT',
      subTitle: 'CREATE NODAL OFFICER',
      msg: `NODAL OFFICER HAVE BEEN CREATED WITH ID ${nodalOfficerId}.`
    });
  });
})

module.exports = createNodalOfficer;