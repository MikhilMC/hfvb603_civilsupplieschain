const express = require('express');
const { ClientApplication } = require('./Client');

const readRetailerPurchase = express.Router();

readRetailerPurchase.post('/', (req, res) => {
  // console.log(req.body);
  let retailerPurchaseNumber = req.body.retailerPurchaseNumber2;
  let RationRetailerClient = new ClientApplication();
  RationRetailerClient.setRoleAndIdentity('ration_retailer', 'rationRetailerAdmin');
  RationRetailerClient.initChannelAndChaincode('civilsupplieschannel', 'civil-supplies-network');
  RationRetailerClient.generatedAndSubmitTxn(
    'readRetailerPurchase',
    retailerPurchaseNumber
  ).then(msg => {
    console.log(msg);
    return msg.toString();
  }).then(result => {
    console.log(result);
    return JSON.parse(result);
  }).then(data => {
    console.log(data);
    if (data['dataType'] === 'Retailer Food Items Purchase') {
      res.render('readRetailerFoodPurchase', {
        title: 'RATION RETAILER DASHBOARD',
        subTitle: 'READ RATION RETAILER FOOD ITEMS PURHCASE',
        retailerPurchaseNumber,
        nodalOfficerId: data['nodalOfficerId'],
        rationRetailerId: data['rationRetailerId'],
        itemName: data['itemName'],
        rationCardColour: data['rationCardColour'],
        isDistributedIndividually: data['isDistributedIndividually'],
        individualQuantity: data['individualQuantity'],
        overallQuantity: data['overallQuantity'],
        pricePerQuantity: data['pricePerQuantity'],
        basicUnit: data['basicUnit'],
        purchaseDate: data['purchaseDate'],
        totalQuantity: data['totalQuantity'],
        presentQuantity: data['presentQuantity'],
        purchaseStatus: data['purchaseStatus']
      });
    } else {
      res.render('readRetailerKerosinePurchase', {
        title: 'RATION RETAILER DASHBOARD',
        subTitle: 'READ RATION RETAILER KEROSINE PURHCASE',
        retailerPurchaseNumber,
        nodalOfficerId: data['nodalOfficerId'],
        rationRetailerId: data['rationRetailerId'],
        itemName: data['itemName'],
        isDistributedIndividually: data['isDistributedIndividually'],
        electrifiedHomesQuantity: data['electrifiedHomesQuantity'],
        electrifiedHomesPricePerQuantity: data['electrifiedHomesPricePerQuantity'],
        nonElectrifiedHomesPricePerQuantity: data['nonElectrifiedHomesPricePerQuantity'],
        nonElectrifiedHomesQuantity: data['nonElectrifiedHomesQuantity'],
        basicUnit: data['basicUnit'],
        purchaseDate: data['purchaseDate'],
        totalQuantity: data['totalQuantity'],
        presentQuantity: data['presentQuantity'],
        purchaseStatus: data['purchaseStatus']
      });
    }
  })
});

module.exports = readRetailerPurchase;