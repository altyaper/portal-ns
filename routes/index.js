var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cuu', { title: 'CUU' });
});

module.exports = router;
