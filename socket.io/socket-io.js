exports.init = function (io, appX) {
  io.on('connection', function (socket) {
    console.log("connected");
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('send comment', function (com) {
      console.log(com)
      socket.broadcast.emit("new comment", com);
    });

    socket.on('send post', function (post) {
      console.log(post)
      socket.broadcast.emit("new post", post);
    })

    socket.on('send event', function (event) {
      socket.broadcast.emit("new event", event);
    })

  });
};