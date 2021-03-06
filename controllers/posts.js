var User = require('../models/users');
var Event = require('../models/events');
var Post = require('../models/posts');
var Comment = require('../models/comments');
var bodyParser= require("body-parser");
var fs = require("fs-extra");


exports.newEvent = function (req, res) {
  console.log((req.body));
    var eventData = req.body;
    var currentUser = req.user;
    console.log('This is ', currentUser);
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var event = new Event({
                title: eventData.title,
                address: eventData.address,
                location: {
                  lat: eventData.lat,
                  lon: eventData.lon
                },
                description: eventData.description,
                date:eventData.date,
                author:currentUser._id
            });
            event.save(function(err, result){
                if(err){
                    console.log(err);
                    res.status(403).send('please complete the from');
                }else{
                    User.findOne({_id:currentUser._id},function(err,user){
                        var event1 = user.event;
                        event1.push(result._id);
                        user.save();
                        console.log('gg', user);
                    });
                    res.status(200).send({data:result, success:true});
                }

            });


    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.onloadEvent = function (req, res) {
  console.log(req);
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
        Post.find()
          .populate('author')
          .populate({
            path: 'comment',
            populate: { path: 'author', select: 'username' }
          })
          .populate('event', 'title')
          .exec(function(err,posts){

            if(posts != null){
                posts.forEach(function(post){
                    postArray.push(post);
                });

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
      author: currentUser._id,
    });
    if(postData.event)
      post.event = postData.event;


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
          if(result.event){
            Event.findOne({_id:result.event}, function (err, event) {
              event.posts.push(result._id);
              event.save();
            })
          }
          Post.findOne({_id:result._id})
            .populate('author')
            .populate('event', 'title').exec(function(err,reslt){
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


exports.newComment = function (req, res) {
  console.log(req)
  var data = req.body;
  if (data == null) {
    res.status(403).send('No data sent!')
  }

  try {
    var comment = new Comment({
      content: data.content,
      date: data.date,
      author: req.user._id,
      post: data.postID
    });

    comment.save(function (err, result) {
      if(err) console.log(err)
      // console.log(result)
      Post
        .findOne(result.post, function(err, post){
          post.comment.push(result._id);
          post.save();
        });
      Comment
        .findOne(result._id)
        .populate('author', 'username')
        .exec( function (err, com) {
          if(err) console.log(err);
          console.log(com)
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(com));
        });
    })
  } catch (e) {
    console.log("fail to create new comment")
    res.status(500).send("error " + e);
  }
}

exports.search = function (keyword, result) {
  console.log(keyword);
  if (!keyword) return;
  var data = {
    postData: [],
    eventData: []
  };

  Post
    .find({$or:[{"author.username":{$regex:keyword,$options: "i"}},
    {content:{$regex:keyword, $options:'i'}}]},function (err, post) {
      // if(err) console.log(err);
      console.log("post: ", post)
      data.postData = post;

      Event.find({ $or: [{ description: {$regex:keyword, $options:'i'} },
            { title: {$regex:keyword, $options:'i'}}] },
        function (err, event) {
          if (err) console.log(event);
          console.log("event: ", event);
          data.eventData = event;
          result(data);
        })
    })
    .populate('author', 'username')
    .populate({
      path: 'comment',
      populate: { path: 'author', populate: "username" }
    })
}


exports.eventinfo = function(req,res){
    Event.findById(req.params.id).populate('author').exec(function(err,event){
        if(err){
            console.log('Show up a ',err)
        }else{
            console.log('here we go', event);
            res.render('event', { event:event});
        }

    })
};

exports.eventmap = function(req,res){
    var eventArray = [];
    Event.find({},function(err,events){
        events.forEach(function(event){
            eventArray.push(event)
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(eventArray));

    })
};






