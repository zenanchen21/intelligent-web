var User = require('../models/users');
var bcrypt = require('bcryptjs');

exports.show = function(req, res){
    var currentUser = req.user
    findById({_id:currentUser.id},function(err,data){
        console.log(data);
    })
};


exports.edituser = function(req, res){
    var currentUser = req.user;
    var userData = req.body;
    try{
        User.findById(currentUser._id,function(err,user){
            console.log('user is:', user);
            if(!user){
                req.flash('error', 'No account found');
                return res.redirect('/users/profile');
            }
            var username = userData.user_name.trim();
            var firsetname = userData.first_name.trim();
            var familyname = userData.family_name.trim();
            var contactnumber= userData.contact_number.trim();
            var jobtitle = userData.job_title.trim();
            // var psw = userData.psw.trim();
            // var psw2 = userData.psw2.trim();
            // console.log('pas2 = ',psw2);

            if(!username){
                // res.status(200).send({falied:true});
                return res.send({msg: "Fail to Login"})

            }
            else if (!firsetname||!familyname||!contactnumber){
                // res.status(200).send({falied:true});
                return res.send({notcomplete:true})

            }

            user.preference.firstname = firsetname;
            user.preference.familyname = familyname;
            user.preference.contactnumber =contactnumber;
            user.preference.jobtitle = jobtitle;

            user.save(function (err,result) {
                // req.flash('success_msg', 'preference added');
                if(err){
                    return res.send({notnumber:true})
                }else{
                    // res.setHeader('Content-Type', 'application/json');
                    // res.send(JSON.stringify(result));
                    res.status(200).send({success:true, msg:'preference added'});
                }

            })


        })
    }catch(e){
        res.status(500).send('this error ' + e);
    }
};

exports.onloadUser = function (req, res) {
    var currentUser = req.user;
    try {
        User.findOne({_id:currentUser._id},).populate('post').populate('event').exec(function(err,posts){
            console.log('im here', posts);
            res.render('profile', { user: posts });

        });
    } catch (e) {
        res.status(500).send('this error ' + e);
    }
};

exports.register = function(req,res){
    var userData = req.body;
    console.log(userData);
    if (userData == null) {
        console.log('no data');
        return res.status(403).send('No data sent!')
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
                                        // res.status(500).send('Invalid data!');
                                        console.log(err);
                                    }else{
                                        // req.flash('success_msg', 'U can log in now');
                                        // res.redirect('/users/login');
                                        return res.status(200).send({success:true});
                                    }


                                    // res.send(JSON.stringify(newuser));
                                });
                            });
                        });


                    }).sort({_id:-1}).limit(1);
                    console.log("u can log now")
                }else{
                    // req.flash('error_msg', 'Email is already used');
                    // res.redirect('/users/register');
                    return res.status(200).send({exsting:true});
                    // res.send(JSON.stringify({"Error":"Email is already used."}));

                }
            });
        }else{

            // req.flash('error_msg', 'password is not matched');
            // res.redirect('/users/register');
            res.status(200).send({nomatch:true});
            // res.send(JSON.stringify({"Error":"password is not matched"}));
        }
    }catch(e){
        console.log('error', e)
    }
};

// exports.register = function(req,res){
//     var userData = req.body;
//     console.log(userData);
//     if (userData == null) {
//         console.log('no data');
//         res.status(403).send('No data sent!')
//     }
//     try{
//         console.log(userData);
//         console.log('no input');
//         console.log('im here');
//         if (userData.psw == userData.psw2) {
//
//             User.findOne({email:userData.email},function(err,data){
//                 if(!data){
//                     var count;
//                     User.findOne({},function (err,data) {
//                         if(data){
//                             count = data.unique_id +1;
//                         }else{
//                             count = 1;
//                         }
//                         var newuser = new User({
//                             unique_id:count,
//                             username: userData.username,
//                             email: userData.email,
//                             password: userData.psw
//                         });
//                         console.log('received: ' + newuser);
//                         bcrypt.genSalt(10,function(err,salt){
//                             bcrypt.hash(newuser.password,salt,function(err,hash){
//                                 if(err){
//                                     console.log(err);
//                                 }
//                                 newuser.password = hash;
//                                 console.log('received: ' + newuser);
//                                 newuser.save(function (err, person) {
//                                     // console.log(results._id);
//                                     if (err){
//                                         res.status(500).send('Invalid data!');
//                                         console.log(err);
//                                     }else{
//                                         req.flash('success_msg', 'U can log in now');
//                                         res.redirect('/users/login');
//                                     }
//
//
//                                     // res.send(JSON.stringify(newuser));
//                                 });
//                             });
//                         });
//
//
//                     }).sort({_id:-1}).limit(1);
//                     console.log("u can log now")
//                 }else{
//                     req.flash('error_msg', 'Email is already used');
//                     res.redirect('/users/register');
//                     // res.send(JSON.stringify({"Error":"Email is already used."}));
//
//                 }
//             });
//         }else{
//
//             req.flash('error_msg', 'password is not matched');
//             res.redirect('/users/register');
//             // res.send(JSON.stringify({"Error":"password is not matched"}));
//         }
//     }catch(e){
//         console.log('error', e)
//     }
// };

