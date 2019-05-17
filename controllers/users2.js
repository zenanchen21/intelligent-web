var User = require('../models/users');
var bcrypt = require('bcryptjs');

exports.register = function(req,res){

};


exports.register = function(req,res){
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
                    res.redirect('/users/register');
                    // res.send(JSON.stringify({"Error":"Email is already used."}));

                }
            });
        }else{

            req.flash('error_msg', 'password is not matched');
            res.redirect('/users/register');
            // res.send(JSON.stringify({"Error":"password is not matched"}));
        }
    }catch(e){
        console.log('error', e)
    }
};