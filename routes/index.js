var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var PostController = require('../controllers/posts');
var initDB= require('../controllers/init');
var User = require('../models/users');
var Post = require('../models/posts');


initDB.init();
initDB.initEvent();

/* GET home page. */
router.get('/',
  PostController.onloadEvent
);

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





/*
* TODO
* can not save new user to database
* also, has problem with
* console.log(results._id);
* */
// router.post('/events', function (req,res, next) {
//   // const event = new Event(req.body.location,req.body.date,req.body.name,req.body.description);
//   // res.setHeader('Content-Type', 'application/json');
//   // res.send(JSON.stringify(event));
// });
router.post('/events', PostController.newEvent);

router.post("/posts", function (req,res, next) {
  const post = new Post(req.body.author,req.body.content);
  console.log(req.body.content);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(post));
});

/**
 * @param name
 * @param location
 * @param date
 * @constructor
 */
// class Event{
//   constructor (location, date, name, description) {
//     this.location= location;
//     this.date = date;
//     this.name = name;
//     this.description = description;
//   }
// }

/**
 *
 * @param n
 * @returns {boolean}
 */
// class Post {
//   constructor (author, content, id) {
//     this.author = author;
//     this.content = content;
//   }
// }


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
