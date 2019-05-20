var mongoose = require('mongoose');
var User = require('../models/users');
var Event = require('../models/events');
var Post = require('../models/posts');
// var Comment = require('../models/comments');

exports.init= function() {
    // uncomment if you need to drop the database
    // User.collection.drop();
    //create a tempplte user for testing
    var user = new User({
        unique_id:'0',
        username: 'admin',
        email: 'test@gmail.com',
        password: '$2a$10$Mxg7Rbz.Q1du7/BMenlaFObP.O9UJ2cS9fvtMB0PdMDaKmNV4/CJG',
    });
    console.log('please, test the web with test@gmail.com, test.');


    user.save(function (err, results) {
        console.log('_id', results._id);
    });



    // uncomment if you need to drop the database
    // Event.collection.drop();
    //create a tempplte user for testing
    var event = new Event({
        title: 'hahahahah1',
        address: 'xixixiixix 1',
        description: 'Im a event',
        location:{
            lat:'41.575330',
            lon:'13.102411'
        },
        author: user._id
    });


    event.save(function (err, results) {
        // console.log(results);
        // console.log(err);
    });

    var event2 = new Event({
        title: 'nihao',
        address: 'nihaoma',
        description: 'Im a event',
        location:{
            lat:'41.575730',
            lon:'13.002411'
        },
        author: user._id
    });


    event2.save(function (err, results) {
        // console.log(results);
        // console.log(err);
    });


    // uncomment if you need to drop the database
    // Event.collection.drop();
    //create a tempplte user for testing
    var post = new Post({
        author: user._id,
        content: 'Im a post',
        date: Date.now(),
    });


    post.save(function (err, results) {
        // console.log(results);
        // console.log(err);
    });


};