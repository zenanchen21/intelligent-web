var User = require('../models/users');
var bodyParser= require("body-parser");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var passport = require('passport');

module.exports = function (req, res){
    passport.use( new LocalStrategy({ usernameField: 'email', passwordField:'psw' }, function(email, psw, done){
            // Match user
        User.findOne({email:email},function(err,user){
            if(user){
                bcrypt.compare(psw, user.password,function(err, isMatch){
                    if(isMatch){
                        console.log('correct password!');
                        return done(null, user);
                    }else{
                        console.log('wrong password');
                        return done (null, false,{message:'wrong password'});
                    }
                });
            }else{
                // res.render('signin', { title: 'Express', login_is_correct:false});
                console.log("user is not exit");
                return done(null, false,{message: 'user is not exit'});

            }
        })
        }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};



