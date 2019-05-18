var User = require('../models/users');
var Event = require('../models/events');
var Post = require('../models/posts');
var Comment = require('../models/comments');
var bodyParser= require("body-parser");
var fs = require("fs-extra");


exports.newEvent = function (req, res) {
    var eventData = req.body;
    var currentUser = req.user.id;
    console.log('This is ', currentUser);
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
            event.save(function(err, result){
                if(err){
                    console.log(err);
                    req.flash('error_msg', 'you log in before posting');
                }else{
                    User.findOne({_id:currentUser},function(err,user){
                        var event1 = user.event;
                        event1.push(result._id);
                        user.save();
                        console.log('gg', user);
                    });

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                }

            });


    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.onloadEvent = function (req, res) {
    var eventArray  = [];
    try {
        Event.find({},function(err,events){
        if(events != null){
            events.forEach(function(event){
                eventArray.push(event);
                console.log(event);

            });

            // console.log('im here', eventArray);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(eventArray));
            // for(var i = 0, imax = events.length; i<imax; i++) {
            //     eventArray += events
            //     console.log('you are here ', eventArray);
            // }
        }else{
            console.log('post is ', err);
        }
    });

    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


exports.onloadPost = function (req, res) {
    var postArray  = [];
    try {
        Post.find({},).populate('author').exec(function(err,posts){
            console.log('im here', posts);

            if(posts != null){
                posts.forEach(function(post){
                    postArray.push(post);
                    console.log(post);
                });
                // for(var i = 0, imax = events.length; i<imax; i++) {
                //     eventArray += events
                //     console.log('you are here ', eventArray);
                // }
                // console.log('you are here', postArray);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(postArray));
            }else{

                console.log('post is ', err);
            }
        });
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

// exports.loadData = function (req, res) {
//   Event.find({}, function (err, events) {
//     if(err) console.log(err);
//     res.send(events);
//   })
// }

exports.newPost = function (req, res) {
  var postData = req.body;
  var postImages = req.files;
  var currentUser = req.user;

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
        author:currentUser._id
      // author: postData.author
    });

    //images
    for(var file of postImages){
      var imgData = {
        data: fs.readFileSync(file.path, 'base64'),
        contentType: 'image/png'
      };
      fs.remove(file.path, err => {
        if (err) return console.error(err);

        console.log('success remove ' + file.path);
      })
      post.img.push(imgData);
    }

    post.save(function (err, result) {
      if(err){
          console.log(err);
      }else{
          // Find  related user ,and add post ObjectID to
          User.findOne({_id:currentUser.id},function(err,user){
              var post1 = user.post;
              post1.push(result._id);
              user.save();
              console.log('gg', user);
          });
          Post.findOne({_id:result._id}).populate('author').exec(function(err,reslt){
             console.log('username = ', reslt);
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(reslt));
          });
      }


    });

  } catch (e) {
    res.status(500).send('error ' + e);
  }
}


exports.newComment = function (req, socket) {
  var data = JSON.parse(req);

  // if (data == null) {
  //   console.log("no data sent")
  //   socketIO.emit
  //   // res.status(403).send('No data sent!')
  // }

  try {
    var comment = new Comment({
      content: data.content,
      date: data.date,
      author: data.author,
      post: data.postID
    });

    comment.save(function (err, result) {
      if(err) console.log(err);
      socket.broadcast.emit("new comment", JSON.stringify(result));
    })
  } catch (e) {
    console.log("fail to create new comment")
    // res.status(500).send("error " + e);
  }
}






