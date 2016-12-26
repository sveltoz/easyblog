﻿var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {    
   // res.locals.user = req.user || null;
    res.render('index');

});

function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
    res.redirect('/users/login');
    }
}
module.exports = router;