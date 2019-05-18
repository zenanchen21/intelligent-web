var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var PostController = require('../controllers/posts');
var initDB= require('../controllers/init');
var User = require('../models/users');

var Post = require('../models/posts');

var multer = require('multer');
var upload = multer({ dest: 'uploads/'})



initDB.init();
// initDB.initEvent();
// initDB.initPost();

/* GET home page. */
router.get('/',function(req, res, next){
  res.render('index', {user: req.user});
});

router.post('/',PostController.onloadPost);

router.post('/loadevent',PostController.onloadEvent);






router.get('/maps', function(req, res, next) {
  res.render('maps',{title:'Map Finder'});
});


router.post('/events', upload.none(), PostController.newEvent);

router.get('/events/:id',function(req,res,next) {
  res.render('event', { title: 'Express', login_is_correct:false});
});


router.post("/posts", upload.array("contentImage[]",3), PostController.newPost);


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
