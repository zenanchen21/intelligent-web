var express = require('express');
var router = express.Router();
const passport = require('passport');
// Load User model
var userController = require('../controllers/users2');
var postController = require('../controllers/posts');





/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express', login_is_correct:false});
});

router.post('/register', userController.register);


router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user, title: 'login'});
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

router.get('/edit',function(req, res, next){
  res.render('edit', { user: req.user });
});

router.post('/edit',function(req, res, next){

});

router.get('/logout',function(req, res, next) {
  req.logout();
  console.log('logout');
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login')
});

module.exports = router;