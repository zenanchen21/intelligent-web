var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var PostController = require('../controllers/posts');
var initDB= require('../controllers/init');
var User = require('../models/users');


initDB.init();
initDB.initEvent();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user});
});

router.get('/maps', function(req, res, next) {
  res.render('maps',{title:'Map Finder'});
});


router.post('/events', PostController.newEvent);

router.post("/posts", PostController.newPost);


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
