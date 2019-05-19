var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var PostController = require('../controllers/posts');
var initDB= require('../controllers/init');
var User = require('../models/users');

var Post = require('../models/posts');
var Event = require('../models/events');

var multer = require('multer');
var upload = multer({ dest: 'uploads/'})



initDB.init();
// initDB.initEvent();
// initDB.initPost();

/* GET home page. */
router.get('/',function(req, res, next){
  res.render('index', {user: req.user});
});

router.get('/snapselfi',function(req, res, next){
  res.render('selfi', {user: req.user});
});

router.post('/',PostController.onloadPost);

router.post('/loadevent',PostController.onloadEvent);

router.post('/newComment', PostController.newComment);

router.get('/maps', function(req, res, next) {
  res.render('maps',{title:'Map Finder'});
});

router.get('/create', function(req, res, next) {
  res.render('create',{title:'Create Event'});
});


router.post('/events', upload.none(), PostController.newEvent);

router.get('/events/:id',function(req,res,next) {
  PostController.eventinfo(req,res);
});



router.post("/posts", upload.array("contentImage[]",3), PostController.newPost);


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
