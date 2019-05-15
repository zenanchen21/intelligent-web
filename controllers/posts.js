var Event = require('../models/events');
var Post = require('../models/posts');
var Comment = require('../models/comments');
var bodyParser= require("body-parser");
var fs = require("fs-extra")

// exports.newEvent = function (req, res) {
//     var eventData = req.body;
//     if (eventData == null) {
//         res.status(403).send('No data sent!')
//     }
//     try {
//         console.log('im here 1');
//         var event;
//         new Promise((resolve) =>{
//             event = new Event({
//                 title: eventData.title,
//                 address: eventData.address,
//                 description: eventData.description,
//                 date:eventData.date,
//                 time:eventData.time,
//             });
//             event.save() //promise
//             console.log('im here 2');
//         }).then(function(success){
//             console.log('recerived:' + event);
//             event.save() //promise
//                 .then(function (results){
//                     console.log(results._id);
//                     res.redirect('/index');
//                 })
//                 .catch(err => {
//                     res.status(500).send('Invalid data');
//                 });
//         });
//     } catch (e) {
//         res.status(500).send('error ' + e);
//     }
// };

exports.newEvent = function (req, res) {
    var eventData = req.body;
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var event = new Event({
                title: eventData.title,
                address: eventData.address,
                description: eventData.description,
                date:eventData.date,
                time:eventData.time,
            });
            event.save();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(event));
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


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

exports.newPost = function (req, res) {
  console.log(req.body);
  console.log(req.files);
  var postData = req.body;
  var postImages = req.files;

  if (postData == null) {
    res.status(403).send('No data sent!')
  }

  try {
    var post = new Post({
      content: postData.content,
      date: postData.date,
      address: postData.address,
      location: postData.location,
      comment: postData.comment,
      // author: postData.author
    });

    //images
    for(var file of postImages){
      var imgData = {
        data: fs.readFileSync(file.path),
        contentType: 'image/png'
      };
      post.img.push(imgData);
    }

    post.save(function (err, result) {
      if(err)
        console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(post));
    });

  } catch (e) {
    res.status(500).send('error ' + e);
  }
}




