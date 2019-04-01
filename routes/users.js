var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});





router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express', login_is_correct:false});
});

router.post('/register', function(req, res, next) {
  var userData = req.body;
  console.log(userData);
  if (userData == null) {
    console.log('no data');
    res.status(403).send('No data sent!')
  }
  try{
    console.log(userData);
    console.log('no input');
    console.log('im here');
    if (userData.psw == userData.psw2) {

      User.findOne({email:userData.email},function(err,data){
        if(!data){
          var count;
          User.findOne({},function (err,data) {
            if(data){
              count = data.unique_id +1;
            }else{
              count = 1;
            }
            var newuser = new User({
              unique_id:count,
              username: userData.username,
              email: userData.email,
              password: userData.psw
            });
            console.log('received: ' + newuser);
            bcrypt.genSalt(10,function(err,salt){
              bcrypt.hash(newuser.password,salt,function(err,hash){
                if(err){
                  console.log(err);
                }
                newuser.password = hash;
                console.log('received: ' + newuser);
                newuser.save(function (err, person) {
                  // console.log(results._id);
                  if (err){
                    res.status(500).send('Invalid data!');
                    console.log(err);
                  }else{
                    req.flash('success_msg', 'U can log in now');
                    res.redirect('/users/login');
                  }


                  // res.send(JSON.stringify(newuser));
                });
              });
            });


          }).sort({_id:-1}).limit(1);
          console.log("u can log now")
        }else{
          req.flash('error_msg', 'Email is already used');
          res.send(JSON.stringify({"Error":"Email is already used."}));

        }
      });
    }else{

      req.flash('success_msg', 'password is not matched');
      res.send(JSON.stringify({"Error":"password is not matched"}));
    }
  }catch(e){
    console.log('error', e)
  }
});






// router.post('/login', function(req, res, next) {
//   var userData = req.body;
//   console.log(userData.username);
//   console.log(userData.psw);
//   console.log(userData);
//   if (userData == null) {
//     res.status(403).send('No data sent!')
//   }
//   try {
//     User.findOne({email:userData.username},function(err,data){
//       if(data){
//         if(data.password ==userData.psw){
//           res.render('index', { title: 'Express', login_is_correct:true});
//           console.log('password correct');
//         }else{
//           res.render('signin', { title: 'Express', login_is_correct:false});
//           console.log('wrong pssword');
//         }
//       }else{
//         res.render('signin', { title: 'Express', login_is_correct:false});
//         console.log("user is not exit");
//       }
//     })
//   } catch(e){
//     res.status(500).send('error ' + e);
//   }
// });

// router.post('/signin', function(req, res, next) {
//   res.render('/signin',UserController.login);
//
// });


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express', login_is_correct:true});
});

// Login with lib passport
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


var isLoggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/users/login')
  }
};

router.get('/profile', isLoggedin,function(req, res, next) {
  res.render('profile', { user: req.user });
});

router.get('/logout',function(req, res, next) {
  req.logout();
  console.log('logout');
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login')
});

module.exports = router;