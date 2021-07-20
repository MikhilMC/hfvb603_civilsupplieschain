const express = require('express');

const shiftFamilyToAnotherTaluk = express.Router();

shiftFamilyToAnotherTaluk.get('/', (req, res) => {
  res.render('shiftFamilyToAnotherTaluk', {
    title: 'SHIFT FAMILY TO ANOTHER TALUK'
  });
});

module.exports = shiftFamilyToAnotherTaluk;