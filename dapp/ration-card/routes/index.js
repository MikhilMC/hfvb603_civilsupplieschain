var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'RATION CARD DASHBOARD',
    subTitle1: 'READ RATION CARD',
    subTitle2: 'READ FAMILY MEMBERS',
    subTitle3: 'READ CONSUMER PURCHASES',
  });
});

module.exports = router;
