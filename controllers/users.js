var User = require('../models/users');
var bodyParser= require("body-parser");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var passport = require('passport');


/*
* TODO
* it shows error onece it have been called,
* but it works fine if we use the function in route/index directly
* */

// exports.login = function (req, res) {
//     var userData = req.body;
//     console.log(userData.eml);
//     console.log(userData.psw);
//     console.log(userData);
//     if (userData == null) {
//         res.status(403).send('No data sent!')
//     }
//     try {
//         User.findOne({email:userData.eml},function(err,data){
//             if(data){
//                 if(data.password ==userData.psw){
//                     res.render('index', { title: 'Express', login_is_correct:true});
//                     console.log('password correct');
//                 }else{
//                     res.render('signin', { title: 'Express', login_is_correct:false});
//                     console.log('wrong pssword');
//                 }
//             }else{
//                 res.render('signin', { title: 'Express', login_is_correct:false});
//                 console.log("user is not exit");
//             }
//         })
//     } catch(e){
//         res.status(500).send('error ' + e);
//     }
// }

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



