var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var PostController = require('../controllers/posts');
var initDB= require('../controllers/init');
var User = require('../models/users');
var multer = require('multer');
var upload = multer({ dest: 'uploads/'})


initDB.init();
initDB.initEvent();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user});
});

router.get('/maps', function(req, res, next) {
  res.render('maps',{title:'Map Finder'});
});


router.post('/events', upload.none(), PostController.newEvent);


router.post("/posts", upload.array("contentImage[]",3), PostController.newPost);
//   function (req, res, next) {
//   console.log(req)
//   // console.log(req.headers['content-type']);
//   // console.log(req.body)
//   // req.headers['content-type'] = "multipart/form-data"
//   // var form = new multiparty.Form();
//   // form.parse(req);
//   // form.on('error', function(err) {
//   //   console.log('Error parsing form: ' + err.stack);
//   //   console.log(req.headers['content-type'])
//   // });
// });



function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
