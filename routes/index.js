var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WK' });
});

router.get('/hilo', function(req, res, next) {
  res.render('hilo', { title: 'HILO' });
});

router.get('/cuu', function(req, res, next) {
  res.render('cuu', { title: 'CUU' });
});

module.exports = router;
