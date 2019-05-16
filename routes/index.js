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
initDB.initEvent();

/* GET home page. */
router.get('/',function(req, res, next){
  res.render('index', {user: req.user});
});

router.post('/',PostController.onloadEvent);

// router.get('/', function(req, res, next) {
//   var resultArray = [];
//   try {
//     mongoose.connect(url,function(err,db){
//       assert.equal(null,err);
//       var cursor = db.collection('event').find();
//       cursor.forEach(function(doc,err){
//         assert.equal(null,err);
//         resultArray.push(doc);
//       },function(){
//         db.close();
//         res.render('index', {items: resultArray, user: req.user});
//       });
//     });
//   } catch (e) {
//     res.status(500).send('error ' + e);
//   }
// });




router.get('/maps', function(req, res, next) {
  res.render('maps',{title:'Map Finder'});
});


router.post('/events', upload.none(), PostController.newEvent);


router.post("/posts", upload.array("contentImage[]",3), PostController.newPost);


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
