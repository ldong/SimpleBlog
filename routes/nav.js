var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('nav', { title: 'nav' });
  //res.render('index', { title: 'Index' });
});

module.exports = router;
