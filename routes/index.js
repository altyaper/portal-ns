'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('portal', { title: 'Portal NS :)', room: 'portal' });
});

router.get('/full', function(req, res, next) {
    res.render('full');
});

module.exports = router;
