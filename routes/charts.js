var express = require('express');
var router = express.Router();

var home = require('../app/controllers/home');
var ChartInfo= require('../app/controllers/chart_controller');


router.get('/chartshow/:name',home.loggedIn,ChartInfo.show);


exports = module.exports = router;
