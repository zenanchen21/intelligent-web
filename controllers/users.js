var User = require('../models/users');
var bodyParser= require("body-parser");

exports.getAge = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        User.find({first_name: userData.firstname, family_name: userData.lastname},
            'first_name family_name dob age',
            function (err, characters) {
                if (err)
                    res.status(500).send('Invalid data!');
                var character = null;
                if (characters.length > 0) {
                    var firstElem = characters[0];
                    character = {
                        name: firstElem.first_name, surname: firstElem.family_name,
                        dob: firstElem.dob, age: firstElem.age
                    };
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(character));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}


exports.insert = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var character = new Character({
            first_name: userData.firstname,
            family_name: userData.lastname,
            dob: userData.year
        });
        console.log('received: ' + character);

        character.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(character));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

/*
* TODO
* it shows error onece it have been called,
* but it works fine if we use the function in route/index directly
* */

exports.login = function (req, res) {
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
}



