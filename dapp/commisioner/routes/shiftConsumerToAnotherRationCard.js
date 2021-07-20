const express = require('express');

const shiftConsumerToAnotherRationCard = express.Router();

shiftConsumerToAnotherRationCard.get('/', (req, res) => {
  res.render('shiftConsumerToAnotherRationCard', {
    title: 'SHIFT CONSUMER TO ANOTHER RATION CARD'
  });
});

module.exports = shiftConsumerToAnotherRationCard;