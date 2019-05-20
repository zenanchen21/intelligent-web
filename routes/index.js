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

//page for taking photo
router.get('/snapselfi',function(req, res, next){
  res.render('selfi', {user: req.user});
});

//request for post store in mongodb
router.post('/',PostController.onloadPost);

//request for event store in mongodb
router.post('/loadevent',PostController.onloadEvent);

//add new comment ot mongodb
router.post('/newComment', PostController.newComment);

//page for map
router.get('/maps', function(req, res, next) {
  res.render('maps',{title:'Map Finder'});
});


//page for creating event
router.get('/create', function(req, res, next) {
  res.render('create',{title:'Create Event'});
});

//add new event to mongodb
router.post('/events', upload.none(), PostController.newEvent);

//detail of event
router.get('/events/:id',function(req,res,next) {
  PostController.eventinfo(req,res);
});

router.get('/all_event',function(req,res,next) {
  res.render("all_event");
});

router.post('/all_event',function(req,res,next) {
  PostController.eventmap(req,res);
});


//upload at max 3 images store into mongodb
router.post("/posts", upload.array("contentImage[]",3), PostController.newPost);

module.exports = router;
