var mongoose = require('mongoose');
var User = require('../models/users');


exports.init= function() {
    // uncomment if you need to drop the database
    User.collection.drop();
    //create a tempplte user for testing
    var user = new User({
        unique_id:'0',
        username: 'admin',
        email: 'test@gmail.com',
        password: '$2a$10$Mxg7Rbz.Q1du7/BMenlaFObP.O9UJ2cS9fvtMB0PdMDaKmNV4/CJG'
    });
    console.log('please, test the web with test@gmail.com, test.');

    /**
     * TODO
     * 每两次跑，才不报错，不然就会报错。
     */
    user.save(function (err, results) {
        console.log(results);
        console.log(err);
    });
}