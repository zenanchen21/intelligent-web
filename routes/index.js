var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var UserController = require('../controllers/users');
var initDB= require('../controllers/init');
var User = require('../models/users')
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', login_is_correct:true});
});

/*
* TODO
* can not save new user to database
* also, has problem with
* console.log(results._id);
* */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express', login_is_correct:false});
});

router.post('/register', function(req, res, next) {
  var userData = req.body;
  console.log(userData);
  if (userData == null) {
    console.log('no data')
    res.status(403).send('No data sent!')
  }
  try{
    console.log(userData);
    console.log('no input')
    console.log('im here');
    if (userData.psw == userData.psw2) {

      User.findOne({email:userData.eml},function(err,data){
        if(!data){
          var count;
          User.findOne({},function (err,data) {
            if(data){
              console.log("if");
              count = data.unique_id +1;
            }else{
              count = 1;
            }
            var newuser = new User({
              unique_id:count,
              username: userData.usn,
              email: userData.eml,
              password: userData.psw
            });
            console.log('received: ' + newuser);

            newuser.save(function (err, person) {
              // console.log(results._id);
              if (err)
                res.status(500).send('Invalid data!');

              // res.send(JSON.stringify(newuser));
            });
          }).sort({_id:-1}).limit(1);
          console.log("u can log now")
        }else{
          res.send(JSON.stringify({"Wrong":"Email is already used."}));
         }
        });
      }else{
        res.send(JSON.stringify({"Success":"password is not matched"}));
      }
  }catch(e){
    console.log('error', e)
  }
});




router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Express', login_is_correct:true});
});

router.post('/signin', function(req, res, next) {
  var userData = req.body;
  console.log(userData.eml);
  console.log(userData.psw);
  console.log(userData);
  if (userData == null) {
    res.status(403).send('No data sent!')
  }
  try {
    User.findOne({email:userData.eml},function(err,data){
      if(data){
        if(data.password ==userData.psw){
          res.render('index', { title: 'Express', login_is_correct:true});
          console.log('password correct');
        }else{
          res.render('signin', { title: 'Express', login_is_correct:false});
          console.log('wrong pssword');
        }
      }else{
        res.render('signin', { title: 'Express', login_is_correct:false});
        console.log("user is not exit");
      }
    })
  } catch(e){
      res.status(500).send('error ' + e);
  }
});

// router.post('/signin', function(req, res, next) {
//   res.render('/signin',UserController.login);
//
// });

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Express' });
});


function isNumeric(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

module.exports = router;
