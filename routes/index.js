var express = require('express');
var router = express.Router();
var io = require("socket.io");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('portal', { title: 'Portal NS :)' });
});

router.get('/full', function(req, res, next){
  res.render('full');
});

module.exports = router;
