var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var initDB= require('../controllers/init');
var User = require('../models/users');
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user});
});

router.get('/index2', function(req, res, next) {
  res.render('index2',{title:'hha'});
});

router.get('/index3', function(req, res, next) {
  res.render('index3',{title:'hha'});
});

/*
* TODO
* can not save new user to database
* also, has problem with
* console.log(results._id);
* */
router.post('/events', function (req,res, next) {
  const event = new Event(req.body.location,req.body.date,req.body.name,req.body.description);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(event));
});

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
class Event{
  constructor (location, date, name, description) {
    this.location= location;
    this.date = date;
    this.name = name;
    this.description = description;
  }
}

/**
 *
 * @param n
 * @returns {boolean}
 */
class Post {
  constructor (author, content, id) {
    this.author = author;
    this.content = content;
  }
}


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
