var Event = require('../models/events');
var Post = require('../models/posts');
var Comment = require('../models/comments');
var bodyParser= require("body-parser");
var fs = require("fs-extra");


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

exports.onloadEvent = function (req, res) {
    var eventArray  = [];
    try {
        Event.find({},function(err,events){
        console.log('im here', events);
        if(events != null){
            events.forEach(function(event){
                eventArray.push(event);
                console.log(event);

            });
            // for(var i = 0, imax = events.length; i<imax; i++) {
            //     eventArray += events
            //     console.log('you are here ', eventArray);
            // }
        }else{
            console.log('post is ', err);
        }
    });

        res.render('index', {items: eventArray, user: req.user});
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


exports.onloadPost = function (req, res) {
    var postArray  = [];
    try {
        Post.find({},function(err,posts){
            console.log('im here', posts);
            if(posts != null){
                events.forEach(function(post){
                    eventArray.push(post);
                    console.log(post);

                });
                // for(var i = 0, imax = events.length; i<imax; i++) {
                //     eventArray += events
                //     console.log('you are here ', eventArray);
                // }
            }else{
                console.log('post is ', err);
            }
        });

        res.render('index', {items: postArray, user: req.user});
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

exports.loadData = function (req, res) {
  Event.find({}, function (err, events) {
    if(err) console.log(err);
    res.send(events);
  })
}

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
        data: fs.readFileSync(file.path, 'base64'),
        contentType: 'image/png'
      };
      post.img.push(imgData);
      // console.log(imgData.data)
    }

    post.save(function (err, result) {
      if(err)
        console.log(err);
      res.setHeader('Content-Type', 'application/json');
      console.log("---------------")
      // console.log(result.img[0].data.toString('base64'))
      res.send(JSON.stringify(result));
    });

  } catch (e) {
    res.status(500).send('error ' + e);
  }
}






